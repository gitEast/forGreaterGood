<!--
 * @Author: East
 * @Date: 2022-02-20 19:21:27
 * @LastEditTime: 2022-02-21 10:21:33
 * @LastEditors: Please set LastEditors
 * @Description: flex 布局
 * @FilePath: \forGreaterGood\forward-intermediate\CSS\flex布局.md
-->

# flex 布局

## 1. flex 是什么？

设为 flex 布局以后，子元素的 `float`, `clear`, `vertical-align` 属性将失效

## 2. 基本概念

- flex 容器

  - 主轴 main start, main end
  - 交叉轴 cross start, cross end

- flex 项目
  - main size
  - cross size

## 3. 属性

- 容器的属性
  1. flex-direction -- 主轴方向
     - row
     - row-reverse
     - column
     - column-reverse
  2. flex-wrap -- 是否换行
     - nowrap (默认)
     - wrap
     - wrap-reverse (换行，且第一行在下方)
  3. flex-flow -- 方向和换行的简写形式
  4. justify-content -- 项目在主轴上的对齐方式
     - flex-start
     - flex-end
     - center
     - space-between
     - space-around
  5. align-items -- 项目在交叉轴上的对齐方式
     - flex-start
     - flex-end
     - center
     - baseLine
     - stretch
       - 如果项目未设高度 or 设为 auto，将占满整个容器的高度
  6. align-content -- 定义多根轴线的对齐方式 当只有一根轴线时，不起作用
     - flex-start
     - flex-end
     - center
     - space-between
     - space-around
     - stretch
- 项目的属性
  1. order
     - 项目的排列顺序
     - 数值越小，排列越前。默认 0
  2. flex-grow
     - 项目的放大比例
     - 默认为 0(即如果存在剩余空间，也不放大)
  3. flex-shrink
     - 项目的缩小比例
     - 默认 1(如果空间不足，该项目将缩小)
     - 负值无效
  4. flex-basis
     - 在分配多余空间之前，项目占据的主轴空间
     - 默认 auto，即项目本来的大小
     - 可以设为跟 `width` 和 `height` 一样的值，然后项目将占据固定空间
  5. flex
     - flex-grow, flex-shrink, flex-basis 的简写
  6. align-self
     - 允许单个项目有与其他项目不一样的对齐方式
     - 值：auto | flex-start | flex-end | center | baseline | stretch
