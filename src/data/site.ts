// src/data/site.ts
// ============================================================
// Central site configuration — the SINGLE source of truth.
// Edit this file to update author info, social links, research
// interests, skills, etc. No .astro files need to be touched.
// ============================================================

export const site = {
  name: 'Zihao Pu',
  url: 'https://puzihao2018.github.io',
  description:
    'PhD Student at King\'s College London - Processing-in-Memory & LLM Acceleration',
  locale: 'zh_CN',

  author: {
    name: 'Zihao Pu',
    subtitle: 'PhD Student · King\'s College London',
    role: 'Processing-in-Memory · LLM Acceleration · Hardware-Software Co-Design',
    institution:
      'Department of Engineering, Faculty of Natural, Mathematical & Engineering Sciences',
    jobTitle: 'PhD Student',
    emails: {
      personal: 'zihao.pu@zihaopu.cn',
      university: 'zihao.pu@kcl.ac.uk',
    },
  },

  social: [
    { name: 'GitHub', platform: 'github', url: 'https://github.com/puzihao2018', username: 'puzihao2018' },
    { name: 'LinkedIn', platform: 'linkedin', url: 'https://linkedin.com/in/zihaopu', username: 'zihaopu' },
    { name: 'KCL Profile', platform: 'website', url: 'https://www.kcl.ac.uk/people/zihao-pu' },
  ],

  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  researchInterests: [
    {
      name: 'Processing-in-Memory (PIM)',
      desc: 'Data-centric computing architectures that break the von Neumann memory bottleneck.',
    },
    {
      name: 'LLM Acceleration',
      desc: 'Hardware acceleration for large language models, optimizing inference and training efficiency.',
    },
    {
      name: 'Hardware-Software Co-Design',
      desc: 'Joint optimization of hardware and software for maximum AI workload performance.',
    },
    {
      name: 'Reconfigurable Computing',
      desc: 'FPGA-based adaptive architectures for flexible computing requirements.',
    },
  ],

  skills: [
    { category: 'Hardware Design & FPGA', items: ['SystemVerilog', 'FPGA', 'ASIC Design', 'Cadence Virtuoso', 'KiCad', 'LTSpice'] },
    { category: 'Computer Architecture & AI', items: ['PIM Architecture', 'SoC Design', 'Computer Architecture', 'Digital IC Design', 'P4'] },
    { category: 'Programming', items: ['Python', 'C/C++', 'MATLAB', 'Git', 'LaTeX'] },
    { category: 'EDA & Simulation', items: ['ModelSim', 'Cadence Spectre', 'Synopsys', 'Vivado', 'Quartus', 'COMSOL'] },
  ],
} as const;

/** Look up a social link URL by platform name */
export function getSocialUrl(platform: string): string | undefined {
  return site.social.find((s) => s.platform === platform)?.url;
}

/** Look up a social link entry by platform name */
export function getSocial(platform: string) {
  return site.social.find((s) => s.platform === platform);
}

export type Site = typeof site;
export type SocialLink = (typeof site.social)[number];
