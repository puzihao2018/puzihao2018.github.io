---
title: "An Article"
description: "This is my first test post, used to verify that the blog system is working properly."
date: 2022-02-13
tags: ["misc"]
published: false
---
This is a test post used to verify that all features of the blog system are working correctly.

## Article Content

Here is the main body of the article. Markdown supports the following features:

### Code Block

```verilog
module counter(
    input clk,
    input rst,
    output reg [7:0] count
);

always @(posedge clk or posedge rst) begin
    if (rst)
        count <= 8'b0;
    else
        count <= count + 1;
end

endmodule
```

### List

- Item 1
- Item 2
- Item 3

### Quote

> This is a quoted passage.

### Link

[Back to blog list](/blog)

---

Thanks for reading!
