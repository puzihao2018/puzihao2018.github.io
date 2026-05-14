---
title: "分子动力学可以用PIM优化的可行性"
description: "分子动力学是药物设计和生物分子研究中的关键模拟方法，主要通过计算原子间力并更新位置来模拟原子运动。虽然 MD 过程涉及大量内存读写，但在单 GPU 环境下，仅约 10–25% 的运行时间属于 memory‑bound 且适合 PIM 加速，即使该部分实现 10 倍加速，整体性能提升也仅约 1.1–1.3 倍。因而 PIM 不是单 GPU MD 主循环的最佳加速方案，但在轨迹分析、邻居列表构建等数据密集型环节仍有潜在价值。"
date: 2026-05-13
tags: ["Arch4Chem","Molecular Dynamics","Blog"]
published: true
---

## TL;DR
分子动力学（Molecular Dynamics, MD）是药物设计和生物分子研究中的重要模拟方法。它通过反复计算原子间作用力并更新原子位置，来模拟原子随时间的运动。

MD 确实有大量内存读写，但现代单 GPU MD 引擎已经被压榨得很彻底。在单 GPU 场景下，真正 memory-bound、留给 PIM 的空间大概只占总运行时间的 **10–25%**。按 Amdahl 算一下，就算这部分拿到 **10× 加速**，整体也就 **1.1–1.3×**。

所以 PIM 不太适合做单 GPU MD timestep loop 的主加速方案。但跳出 timestep loop，trajectory analysis、ensemble workflow、neighbour-list / data-layout preprocessing 这些数据移动密集的环节，可能仍有研究价值。

### 几个术语

- **Docking**：快速预测小分子如何放入蛋白质结合口袋的方法，通常比 MD 更静态、更近似。
- **Trajectory**：MD 输出的原子运动轨迹，也就是一系列随时间变化的分子结构。
- **Neighbour list**：记录每个原子附近原子的数据结构，用于减少不必要的原子对计算。
- **PME**：处理长程静电相互作用的常用算法，通常涉及网格和 FFT。
- **Timestep loop**：MD 的主循环，每一步都计算力并更新原子位置。
- **PIM**：Process in memory，存内计算，通过将计算单元放在靠近存储单元的方式，或是将存储单元本身用做计算的方式，减少访存瓶颈，适合计算密度低，访存要求高的场景

# 1. 什么是分子动力学？
**分子动力学**是一种用于模拟原子和分子随时间运动的计算方法。

简单来说，MD 回答的是：

> 给定当前所有原子的位置，下一小段时间之后它们会如何移动？

常见的应用场景包括：

- 药物发现
- 蛋白质-配体结合分析
- 材料科学
- 蛋白质折叠研究
- 膜蛋白模拟
- 酶动力学
- 生物分子机制研究

在药物设计中，MD 通常用于 docking 或虚拟筛选之后。Docking 给出相对静态的结合姿态，而 MD 可以进一步检查这个结合姿态在动态环境中是否稳定。

例如：
```
蛋白质 + 配体 + 水 + 离子  
↓  
分子动力学模拟  
↓  
原子运动轨迹  
↓  
分析结合稳定性、相互作用、柔性和构象变化
```

MD 的价值在于：蛋白质不是刚性的。药物结合过程中会涉及分子运动、水分子重排、侧链旋转、诱导契合，以及有时较长时间尺度上的构象变化。

# 2. 分子动力学在算什么？
经典 MD 基于牛顿力学。
对每个原子：
$$F=ma$$
模拟过程会反复计算每个原子受到的力，然后更新原子的位置和速度。

<iframe
  src="/assets/visualization.html"
  width="100%"
  height="800"
  style="border: 1px solid #334155; border-radius: 0.5rem;"
  loading="lazy"
></iframe>


一个简化的 MD 循环如下：

```
初始原子结构
        ↓
分配力场参数
        ↓
对每个时间步：
    构建/更新邻居列表
    计算成键作用力
    计算短程非成键作用力
    计算长程静电相互作用
    应用约束
    更新位置和速度
    偶尔写入轨迹文件
        ↓
输出轨迹
```

MD 的输出不是一个单一结构，而是一条**轨迹**，即分子构象随时间变化的序列。
## 力场计算
经典 MD 通常不直接求解量子力学问题。它使用的是力场：
$$E_{total}=E_{bond}+E_{angle}+E_{dihedral}+E_{nonbonded}$$
主要力场项包括：

|项|含义|计算角色|
|---|---|---|
|键伸缩|键长变化|低开销|
|角弯曲|键角变化|低开销|
|二面角旋转|围绕化学键旋转|中等开销|
|范德华作用|短程原子相互作用|高开销|
|静电作用|电荷-电荷相互作用|很高开销|
|PME / Ewald|长程静电作用|高开销|

其中，最昂贵的部分通常是**非成键作用力计算**，尤其是范德华作用和静电作用。

## 计算需求
典型全原子 MD 的 timestep 非常小，通常设定为 1–2 fs。以 2 fs 为例，1 ns 就需要 500,000 步，1 µs 需要 500,000,000 步。对于一个 **100 万原子系统**，假设每个原子平均有约 **100 个邻居**，则每个时间步中的短程成对相互作用数量大约是：

1,000,000 × 100 / 2 = 50,000,000 对相互作用 / 时间步

每个时间步可能涉及：

- 坐标读取
- 参数读取
- 邻居列表读取
- 力累加写入
- PME 网格操作
- 约束更新
- 轨迹输出

每一步本身不一定复杂，但需要重复数百万到数十亿次，这就是 MD 昂贵的根本原因。更关键的是，MD 是时间推进型仿真：每个 timestep 内部的力计算可以大规模并行化，但 timestep 之间存在严格依赖——下一步必须等当前步的位置和速度更新完成才能开始。这就决定了单条 MD trajectory 的强 scaling 会被 timestep 依赖、同步和通信开销卡住。

## 存储需求
一个 100 万原子系统不需要特别巨大的内存容量。近似运行时内存需求：
> 原始原子状态: ~100–300 MB
> 实际模拟内存: ~2–8 GB
> 保守的引擎级内存: ~5–15+ GB.   

这完全可以装入现代 GPU 显存，所以对单 GPU MD 来说，容量通常不是核心瓶颈。真正的问题不是"能不能装下"，而是这些坐标、力、邻居列表和 PME 网格数据要在数百万到数亿个 timestep 里被反复访问和更新。话虽如此，现代 GPU MD 引擎已经用 GPU-resident execution、kernel 优化、通信/计算重叠等手段把数据移动开销压得很低\[2]，内存访问也不一定是全局主导瓶颈。

## 主要算力瓶颈分析

| Kernel      | 作用        | 瓶颈类型                |
| ----------- | --------- | ------------------- |
| 短程非成键作用力    | 计算成对相互作用  | 计算密集，有时也对内存敏感       |
| 邻居列表遍历      | 找到附近原子对   | 不规则内存访问             |
| 邻居列表构建      | 构建空间配对列表  | 内存/数据结构密集           |
| PME 电荷分配/插值 | 粒子与网格之间映射 | scatter/gather 内存流量 |
| PME FFT     | 长程静电计算    | 内存移动和通信             |
| 力累加         | 汇总力贡献     | 写入/reduction 开销     |
| 积分          | 更新位置和速度   | 流式内存访问              |
| 轨迹输出        | 保存模拟帧到磁盘  | 存储/I/O 密集           |

关键点是：
> MD 不是一个单一 kernel，而是由计算密集、内存密集和通信密集的多个 kernel 组成。
# 3. 分子动力学可以用PIM优化吗
PIM 适合用于性能受数据移动限制、而不是受算术计算限制的任务。

从访存特征上看，MD 确实有 PIM 喜欢的味道——它在每个 timestep 反复读写：

```
- 坐标
- 力
- 邻居列表
- PME 网格
```

但放到**单 GPU 场景**里，情况就没那么乐观了。

GROMACS、NAMD、AMBER、OpenMM、Desmond 这些主流 MD 引擎都已经对主导 kernel 做了深度 GPU 优化。以 GROMACS 为例，官方文档指出 non-bonded pair kernels 通常是 MD 中最 compute-intensive 的部分，占总 runtime 的 60–90% \[1]。所以真正要回答的问题不是：

> PIM 能不能比 CPU 跑得快？

而是：

> PIM 能不能在已经被深度优化的单 GPU baseline 之上继续加速？

这要难得多。

假设一个单 GPU MD 运行时间大致如下划分：

| 组成部分         | 运行时间占比 | 是否适合 PIM | 说明                         |
| ------------ | -----: | -------: | -------------------------- |
| 优化后的非成键作用力计算 | 60–90% |       有限 | 通常最大，但已被 GPU 高度优化          |
| PME          | 10–20% |     部分适合 | FFT、grid mapping、通信影响较大    |
| 邻居列表构建/遍历    |  5–15% |       适合 | 不规则内存访问，但不一定每步执行           |
| 积分/约束        |  5–10% |       有限 | GPU-resident 模式下也可 offload |
| I/O 和其他      |  1–10% |     有时适合 | 不在 MD 仿真的 critical path 上    |

_当然，具体比例仍然依赖 MD engine、force field、PME 设置、GPU 型号、系统大小和 simulation parameters；严格结论需要通过 Nsight / GROMACS timing breakdown 对目标系统做 profiling。_

明确适合 PIM 的部分大概占总运行时间的 10–25%。套一下 Amdahl's Law：
$$S_{total}=\frac{1}{(1-f)+\frac{f}{S_{acc}}}$$
其中 $S_{total}$ 是总加速倍数，$f$ 是可加速部分的比例，$S_{acc}$ 是可加速部分的加速倍数。乐观地取 $f=0.25$，假设 PIM 对 memory-bound 部分做到 10× 加速，且不考虑其他 overhead：
$$S_{total}=\frac{1}{0.75+0.25/10}=1/0.775\approx1.29$$
整体也就 1.29×。即便这 25% 被无限加速，理论上限也只有 1.33×：
$$S_{max}=\frac{1}{1-0.25}=1.33$$
也就是说，对单 GPU MD 的原始吞吐量来说，PIM 大概率拿不到一个量级的提升。它能改善若干 memory-bound kernel，但很难改变整体性能曲线。
# 4. Limitations and Discussions
## MD 很重要，但不一定适合 PIM

MD 在药物设计中重要，不代表它就是好的 PIM workload。一个比较理想的 PIM workload 通常具备：

- 大量内存流量
- 低算术强度
- 较差的缓存局部性
- 显著的运行时间占比

某些 MD kernel 确实符合，比如邻居列表构建和轨迹分析。但主导每个 timestep 的 kernel 已经在 GPU 上被压榨得差不多了——GROMACS 这类引擎通过 GPU-resident execution、kernel 优化、通信/计算重叠把每步 CPU-GPU 数据传输降到最低，> 在多 GPU 场景下，GROMACS 还支持 PME-PP GPU direct communication pipelining，把 PME coordinate transfer 与 Spread/Spline kernel 计算重叠起来。\[2]。timestep loop 内部留给 PIM 的优化空间已经不多了。

## PIM 的机会：跳出 timestep loop

如果 PIM 在 timestep loop 里没空间，那机会大概率在 loop 之外。长时间 MD 不会每步都存轨迹，但会按固定间隔输出 trajectory frame。百万原子系统跑长时间尺度仿真，轨迹文件累积到几百 GB 甚至 TB 级是常态。后续的 RMSD/RMSF、contact map、氢键统计、距离查询、binding pose stability filtering 这些分析任务，需要反复扫描这堆数据——这类工作负载对 PIM 或者 in-storage processing 来说，比原始 MD timestep loop 友好得多。

## References

\[1] [gmx nonbonded-benchmark - GROMACS documentation](https://manual.gromacs.org/current/onlinehelp/gmx-nonbonded-benchmark.html)  
\[2] [Performance improvements - GROMACS 2026.2 documentation](https://manual.gromacs.org/current/release-notes/2022/major/performance.html)  
\[3] [Getting good performance from mdrun - GROMACS documentation](https://manual.gromacs.org/documentation/current/user-guide/mdrun-performance.html)  

