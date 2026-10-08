---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
description: ""          # câu mô tả ngắn hiện dưới tiêu đề và ở danh sách bài
tags: []                 # ví dụ ["tản văn", "sách"]
draft: true              # viết xong thì xoá dòng này (hoặc đổi thành false) để bài hiện lên
# math: true             # bỏ dấu # nếu bài có công thức toán
# comments: false        # bỏ dấu # để tắt bình luận riêng bài này
---

Viết nội dung ở đây.
