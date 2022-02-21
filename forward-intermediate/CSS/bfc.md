<!--
 * @Author: your name
 * @Date: 2022-02-21 10:32:22
 * @LastEditTime: 2022-02-21 13:43:39
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\forward-intermediate\CSS\bfc.md
-->

# BFC

## 1. 形成原因

块级格式化上下文。

1. 上下的外间距会取最大
2. 父子元素，子元素使用 margin，但仍顶部重叠

## 2. 解决办法

1. 使用 float 除 none 以外的值
2. 使用绝对定位
3. `overflow: hidden | auto | scroll`
4. `display: inline-block table-cells | flex`
