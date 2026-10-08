---
title: "Ví dụ các định dạng trong bài"
date: 2026-08-02T21:00:00+07:00
description: "bài mẫu để xem code, công thức toán, bảng và trích dẫn hiển thị thế nào."
tags: ["ghi chú", "kỹ thuật"]
math: true
dropcap: false
draft: true
---

Bài này chỉ để xem thử giao diện. Xem xong thì xoá đi nhé.

## Tiêu đề cấp hai

Một đoạn văn bình thường có **chữ đậm**, *chữ nghiêng*, `code ngắn` và [một đường link](https://gohugo.io).

### Danh sách

- ý thứ nhất
- ý thứ hai, dài hơn một chút để xem chữ xuống dòng thế nào khi hết chỗ
- ý thứ ba

1. bước một
2. bước hai

### Code

```python
import numpy as np

def softmax(x: np.ndarray) -> np.ndarray:
    # trừ max để tránh tràn số
    z = np.exp(x - x.max())
    return z / z.sum()

print(softmax(np.array([1.0, 2.0, 3.0])))
```

### Công thức toán

Công thức trong dòng: \( e^{i\pi} + 1 = 0 \). Công thức riêng một dòng:

$$
p(\theta \mid x) = \frac{p(x \mid \theta)\, p(\theta)}{p(x)}
$$

### Bảng

| ngôn ngữ | dùng để | cảm giác |
|---|---|---|
| Python | phân tích dữ liệu | quen thuộc |
| Julia | mô phỏng | nhanh |

### Trích dẫn

> Viết là cách để biết mình thực sự nghĩ gì.

---

Hết bài mẫu.
