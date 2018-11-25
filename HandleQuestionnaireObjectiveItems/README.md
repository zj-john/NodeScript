## HandleQuestionnaireObjectiveItems
用于分析问卷调查中，有default项，也有客观回答的题目的答案统计。（For Xiaoxiao）


## 使用方法
1. default.txt：存放默认选项
2. source.txt：存放问卷结果（以Excel格式为例）
3. 运行
```
node handle.js
```

统计结果显示在命令行中，非default的答案统计在other.txt中
