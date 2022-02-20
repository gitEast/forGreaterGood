<!--
 * @Author: East
 * @Date: 2022-02-20 13:46:03
 * @LastEditTime: 2022-02-20 19:21:15
 * @LastEditors: Please set LastEditors
 * @Description: CSS 的基础面试提
 * @FilePath: \forGreaterGood\forward-intermediate\CSS\50道CSS基础面试题.md
-->

# 50 道 CSS 基础面试提

## 1. 盒子模型

- 标准盒子模型：宽度 = 内容的宽度(content) + padding + boder + margin
- 低版本 ID 盒子模型：宽度 = 内容宽度(content + padding + border) + margin

`box-sizing` 属性：

- 默认 `content-box`
- 选择的值
  - `content-box`：W3C 的标准盒子模型
  - `border-box`：IE 传统盒子模型

## 2. 选择器 + 可以继承的属性

- CSS 优先级(优先级从高到低)
  1. `!important`
  2. 内联
  3. id 选择器 (#id)
  4. 类选择器 (.class)
  5. 标签选择器
  6. 。。。
  7. 继承
- 其他选择器
  - 相邻选择器：`h1+p`
- 可以继承的属性：
  - `font-size`
  - `font-family`
  - `color`

## 3. 居中

1. div：确定宽高，对 `margin` 使用 `auto`
   ```css
   height: 50px;
   width: 80px;
   margin: 0 auto;
   ```
2. 浮动元素的上下左右居中
   ```html
   <div class="outer">
     <div class="inner"></div>
   </div>
   ```
   ```css
   .outer {
     background-color: green;
     height: 300px;
     width: 600px;
     margin: 500px auto;
   }
   .inner {
     height: 200px;
     width: 400px;
     background-color: orange;
     float: left;
     margin: calc(25% - 100px) 0 0 calc(50% - 200px);
   }
   ```
3. 子绝父相的居中

   ```html
   <div class="outer">
     <div class="inner"></div>
   </div>
   ```

   ```css
   .outer {
     background-color: green;
     height: 300px;
     width: 600px;
     margin: 500px auto;
     position: relative;
   }
   .inner {
     height: 200px;
     width: 400px;
     background-color: orange;
     position: absolute;
     top: calc(50% - 100px);
     left: calc(50% - 200px);
   }
   ```

4. flexbox 方法

## 4. display 的值

- inline
- none -- 隐藏
- block -- 块级
- block-inline
- table -- 表格
- list-item 列表

## 5. position 的值

1. static -- 默认
2. relative
3. absolute
4. fixed -- 参照可视窗口

## 6. CSS3 新特性

1. `word-wrap：break-word` ：将长单词切割
2. 媒体查询
   1. CSS
      ```css
      @media screen and (min-width: 480px) {
        body {
        }
      }
      ```
   2. `<head>`里面
      ```html
      <link
        rel="stylesheet"
        type="text/css"
        href="xxx.css"
        media="only screen and (max-device-width: 480px)"
      />
      ```

## 7. 创建一个三角形

```css
width: 0;
height: 0;
border-top: 40px solid transparent;
border-left: 40px solid transparent;
border-right: 40px solid transparent;
border-bottom: 40px solid red;
```

## 8. 常见的兼容性问题

1. Chrome 中文界面下默认会将小于 `12px` 的文本强制按照 `12px` 显示，
   - 可通过加入 CSS 属性 `webkit-text-size-adjust: none` 解决
   - 或者
     ```css
     p {
       font-size: 10px;
       -webkit-transform: scale(o.8);
     }
     ```
2. 超链接访问过后 hover 样式就不出现了，被点击访问过的超链接样式不再具有 hover 和 active 了。解决办法：LVHA 即(link, visited, hover, active)
3. 为什么要初始化 CSS 样式？
   - 因为浏览器的兼容问题。不同浏览器对有些标签的默认值是不同的，如果没有对 CSS 进行初始化，往往会出现浏览器之间的页面显示差异

## 9. `display: none` 与 `visibility: hidden` 的区别

- `display: none` ：不再显示，也不再分配空间(回流 + 重绘)
- `visibility: hiddren`：仅不再显示(重绘)

## 10. CSS 优化、提升性能

1. 避免后代选择器
2. 避免链式选择器
3. 使用紧凑的语法
4. 避免不必要的命名空间
5. 避免不必要的重复
6. 最好使用表示语义的名字，一个好的类名应该是描述 它是什么 而不是 像什么
7. 避免 `!important`
8. 尽可能精简规则，可以合并不同类里的重复规则

## 11. 在网页中应该使用奇数还是偶数的字体大小？

偶数。因为偶数相对更容易和 web 设计的其他部分构成比例关系

## 12. 全屏滚动的原理是什么？使用了哪些属性？

1. 原理
   - 类似于轮播，整体的元素一直排列下去。
     - 假设有 5 个需要展示的全屏页面，那么高度是 500%，只展示 100%，剩下的可以通过 `transform` 进行 y 轴定位，也可通过 `margin-top` 定位
2. 使用的属性
   ```css
   .class {
     overflow: hidden;
     transition: all 1000ms ease;
   }
   ```

## 13. li 与 li 之间有看不见的空白间距

- 原因：行框的排列会受到中间空白(回车空格)等的影响，因为空格也属于字符，也会应用样式
- 解决办法：
  1. 可以将 `<li>` 代码全部写在一排 ---- 这是什么憨批才会用的方式哦
  2. 对 li 元素添加 `float: left`
  3. 使用 `letter-space: -3px`

## 14. 有一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度

1. 外层 div 使用 相对定位
2. 内部剩下的 div 使用 绝对定位
   ```css
   .inner {
     position: absolute;
     top: 100px;
     bottom: 0;
     left: 0;
     right: 0;
   }
   ```

## 15. png, jpg, gif, webp

- png：便携式网络图片
  - 无损数据压缩位图文件格式
  - 优点：压缩比高，色彩好
  - 大多数地方都可以用
- jpg：
  - 针对相片使用的一种失真压缩方法，是一种破坏性的压缩
  - 优点：在色调及颜色平滑变化上做得不错
  - 用于存储和传输照片的格式
- gif
  - 位图文件格式，以 8 位色重现真色彩的图像
  - 优点：可以实现动画效果
- webp
  - 谷歌在 2010 推出的图片格式
  - 优点：压缩率只有 jpg 的 2/3，大小比 png 小了 45%
  - 缺点：压缩的时间更久了，兼容性不好，目前只有 谷歌 和 opera 支持

## 16. style 标签 写在 body 后 与 body 前 有什么区别？

页面加载自上而下，当然先加载样式

- 写在 body 后：
  1. 浏览器以逐行的方式对 HTML 文档进行解析
  2. 当解析到写在尾部的 样式表(外联 or 内联)，会导致浏览器停止之前的渲染，等待且加载样式表完成之后重新渲染
  3. 会导致 Windows 的 IE 可能会出现 FOUC 现象(即 样式失效导致的页面闪烁问题)

## 17. `overflow` 属性定义溢出元素内容区的内容会如何处理？

- scroll：一定会出现滚动条
- auto：当 子内容 > 父内容时，会出现滚动条
- visible：溢出内容出现在父元素之外
- hidden：隐藏溢出内容
