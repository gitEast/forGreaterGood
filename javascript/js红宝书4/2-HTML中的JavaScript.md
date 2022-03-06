<!--
 * @Author: East
 * @Date: 2022-02-26 16:19:49
 * @LastEditTime: 2022-03-05 20:53:07
 * @LastEditors: Please set LastEditors
 * @Description:
                 1. 使用 <script> 元素
                 2. 行内脚本与外部脚本的比较
                 3. 文档模式对 JavaScript 有什么影响
                 4. 确保 JavaScript 不可用时的用户体验
 * @FilePath: \forGreaterGood\javascript\js红宝书4\2-HTML中的JavaScript.md
-->

# Chapter Ⅱ HTML 中的 JavaScript

将 JavaScript 引入网页，首先要解决它与网页的主导语言 HTML 的关系问题。

## 1. `<script>` 元素的使用

将 JavaScript 代码插入到 HTML 的主要方法是使用 `<script>` 元素。---- 网景公司创造，并在 Netscape Navigator 2 中首次实现。

### 1.1 `<script>` 的属性

- **async**
  - 目的：立即下载 JavaScript 文件但不执行。
  - 各 JavaScript 文件之间**没有依赖关系**。
  - 保证在 页面的 load 事件前执行，但可能会在 DOMContentLoaded 之前或之后
- charset
  - 可选
  - 字符集
  - 很少使用，大多数浏览器不在乎它的值
- crossorigin
  - 可选
  - 配置相关请求的跨域设置
- **defer**
  - 可选
  - 先下载，但延迟到文档完全被解析和显示之后再执行
    - HTML 5 规范要求，脚本需要在 DOMContentLoaded 之前执行。且脚本按编写顺序执行。
    - 但实际上，推迟执行的脚本不一定总会按照顺序执行 or 在 DOMContentLoaded 事件之前执行。
    - IE4, Firefox3.5, Safari 5 和 Chrome 7 开始支持，其他浏览器会忽略这个属性。鉴于此，建议把要推迟执行的脚本放在页面底部比较好
- integrity
  - 可选
  - 看不懂。
    - 允许比对接收到的资源和指定的加密签名以验证子资源的完整性。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面报错，脚本不执行。
- language
  - 废弃。
- src
- type
  - 可选
  - 代替 `language` 属性，代表代码块中脚本语言的内容类型(也称 MIME 类型)
  - 惯例，值是 `"text/javascript"`
    - JavaScript 文件的 MIME 类型通常是 `"application/x-javascript"`
    - `"module"` --> ES6 模块
    - `"application/javascript"` --- 不晓得干嘛的
    - `"application/ecmascript"` --- 不晓得干嘛的

### 1.2 使用方式 --- 直接嵌入 or 引入外部文件 or 动态加载

1. 直接嵌入 JavaScript 代码
   - 自上而下解释
   - `<script>` 元素中的代码被计算完成之前，页面的其余内容不会被加载，也不会被显示
   - 内部代码不允许出现 `</script>`，只能通过转义字符使用
2. 引入外部 JavaScript 文件
   - by `src` 属性
   - 不能在标签内部包含 JavaScript 代码，会被忽略
   - 文件资源可跨域，内部代码执行不可跨域
   - 优点
     1. 可维护性。---- js 代码如果分散到很多 HTML 文件中会导致维护困难
     2. 缓存。---- 如果两个页面都用到一个文件，则这个文件只需下载一次。这意味着页面加载更快。
     3. 适应未来。---- 包含外部 JavaScript 的语法在 HTML 和 XHTML 中是一样的。-- 这个...现在好像不需要考虑了
3. 动态加载
   ```js
   const script = document.createElement("script");
   script.scr = "other.js";
   document.head.appendChild(script);
   ```
   - 使用 DOM API 动态添加 script 元素 来 加载指定脚本
   - 默认情况下，以这种方式创建的 `<script>` 元素是**以异步方式加载的，相当于添加了 `async` 属性**
   - 但由于不是所有浏览器都支持 `async` 属性，可以明确将其设置为同步加载 `script.async = false`
   - 令浏览器预加载器知道这些动态请求文件的存在 `<link rel="preload" href="other.js">`

如果不使用 `defer` 和 `async` 属性，浏览器按照 `<script>` 标签顺序依次解释。

### 1.3 使用位置

如果不使用 `async` 和 `defer` 属性的话

1. 页面的 `<head>` 标签内
   - 目的：把外部的 CSS 和 JavaScript 文件都集中在一起
   - 缺点：必须把所有的 JavaScript 代码都下载、解析和解释完成后，才能开始渲染页面 ---- which means 对于需要很多 JavaScript 的页面，这会导致**页面渲染的明显延迟**，在此期间，**浏览器窗口完全空白**
2. 在页面内容之后使用 `<script>` 标签
   - 优点：页面会在处理 JavaScript 代码之前完全渲染页面，由于浏览器显示空白页面的时间短了，用户会感觉页面加载更快了。

### 1.4 XHTML

不管啦，反正是退出历史舞台的老古董。

## 2. 文档模式

IE 5.5 发明了文档模式的概念，即可以使用 `doctype` 切换文档模式。

- 文档模式
  - 混杂模式 quirks mode
  - 标准模式 standards mode
  - 准标准模式 almost standards mode

不太懂...

## 3. `<noscript>` 元素

- 使用场景
  - 浏览器不支持脚本
  - 浏览器对脚本的支持被关闭
- 用法
  ```html
  <body>
    <noscript>
      <p>This page requires a JavaScript-enabled browser.</p>
    </noscript>
  </body>
  ```

## 4. 小结

1. 要包含外部 JavaScript 文件，必须将 src 属性设置为要包含文件的 URL。文件可以跟网络在同一台服务器上，也可以位于完全不同的域。
2. 所有 `<script>` 元素会依照它们在网页中出现的次序被解释。在不使用 `defer` 和 `async` 属性的情况下，包含在 `<script>` 元素中的代码必须严格按照次序解释。
3. 对不推迟执行的脚本，浏览器必须解释完位于 `<script>` 元素中的代码，然后才能继续渲染页面的剩余部分。为此，通常应该把 `<script>` 元素放到页面末尾，介于主内容之后及 `</body>` 标签之前
4. 可以使用 `defer` 属性把脚本推迟到文档渲染完毕再执行。推迟的脚本原则上按照它们被列出的次序执行。
5. 可以使用 `async` 属性表示脚本不需要等待其他脚本，同时也不阻塞文档渲染，即异步加载。异步脚本不能保证按照它们在页面中出现的次序执行。
6. 通过使用 `<noscript>` 元素，可以指定在浏览器中不支持脚本时显示的内容。如果浏览器支持并启用脚本，则 `<noscript>` 元素中的任何内容都不会被渲染。
