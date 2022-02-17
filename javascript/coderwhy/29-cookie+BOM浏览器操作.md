<!--
 * @Author: East
 * @Date: 2022-02-17 09:00:33
 * @LastEditTime: 2022-02-17 14:29:10
 * @LastEditors: Please set LastEditors
 * @Description: Cookie + BOM 浏览器操作
 * @FilePath: \forGreaterGood\javascript\coderwhy\29-cookie+BOM浏览器操作.md
-->

# Cookie + BOM 浏览器操作

## 一、Cookie

js 代码什么都不用做，由浏览器设置

### 1.1 认识 Cookie

- 类型为 小型文本文件，某些网站为了辨别用户身份而存储在用户本地终端(Client Side)上的数据
  - 浏览器会在特定的情况下携带上 Cookie 来发送请求，可以通过 Cookie 来获取一些信息
- 总是保存在客户端中，按在客户端中的存储位置，分为
  - 内存 Cookie
    - 浏览器关闭时，Cookie 即消失
    - 没有设置过期时间，默认情况
  - 硬盘 Cookie
    - 有一个过期时间，用户手动清理或到期时才会被清理
    - 有设置过期时间，并且过期时间不为 0 或者 负数
- Response Header -- 服务器响应头自动携带
  - Set-Cookie
- Request Header -- 浏览器请求头

- 一种登录机制
- 与服务器关系更紧密，一般由服务器设计，浏览器自动带上
  - js 也可以操作

### 1.2 Cookie 基本使用

- 老师的 cookie-server 代码

### 1.3 常见属性

- 生命周期
  - 默认情况下，内存 cookie 即 会话 cookie，在浏览器关闭时自动被删除
  - 通过设置 expires 或者 max-age 来设置过期时间
    - expires：Date.toUTCString()，格式为 `;expires=date-in-GMTString-
    - max-age：过期的秒钟
- 作用域
  - Domain：指定哪些主机可以接受 cookie
    - 如果不指定，默认 origin，不包括子域名
    - 如果指定，则包含子域名。如，Domain=mozilla.org，则 developer.mozilla.org 也包含 cookie
  - Path：指定主机下哪些路径可以接受 cookie

### 1.4 操作 cookie

- 在控制台输入 `document.cookie` 拿不到 cookie
- 可以在控制台添加 cookie：`document.cookie="age=18"`
- 删除 cookie 做不到
  - 只能设置 cookie 过期：`document.cookie="name=why;max-age=0"`

### 1.5 缺点

1. cookie 会被附加到每一次的 http 请求中，有的时候不需要，会消耗用户流量
2. 明文传输
3. 大小限制：4kb
4. cookie 验证登录：客户端携带 cookie
   - 浏览器：会自带，但其他客户端不带
   - iOS
   - 小程序
   - ...

总而言之，现在 cookie 用得少了，多用 token(非对称加密 or 对称加密)

## 二、BOM 浏览器操作

> JavaScript 有一个非常重要的运行环境——浏览器，浏览器本身又作为一个应用程序需要对其本身进行操作，所以通常浏览器会有对象模型 —— BOM (浏览器对象模型)

### 2.1 认识 BOM

- 浏览器本身也是一种软件

* 可以将 BOM 看成是连接 JavaScript 脚本 和 浏览器窗口 的 桥梁
* 主要包括的对象模型
  - window：包括全局属性、方法，控制浏览器窗口相关的属性、方法
  - location：浏览器连接到的对象的位置(URL)
  - history：操作浏览器的历史
  - document：当前窗口操作文档的对象

### 2.2 window

- window 对象在浏览器中有两个身份
  - 身份一：全局对象
    - GO root object
  - 身份二：浏览器窗口对象
- window 窗口对象 ---- 身负重担
  - 大量的属性：60 多个，localStorage、console、location、history、screenX，scrollX...
  - 大量的方法：alert、close、scrollTo、open...
  - 大量的事件：focus、blur、load、hashchange...
  - 包含从 EventTarget 继承过来的方法：addEventListener, removeEventListener, dispatchEventListener...
    - window 是 Window 类创建的 对象，Window 类 继承自 EventTarget

### 2.3 window 的常见属性 + 方法 + 事件

#### 2.3.1 属性

1. screenX 和 screenY：当前窗口距离左边和顶部的长度
2. scrollX 和 scrollY：滚动
   ```js
   window.addEventListener("scroll", () => {
     console.log(window.scrollX, window.scrollY);
   });
   ```
3. outerHeight 整个浏览器窗口的高度，innerHeight 内部展示内容的高度

#### 2.3.2 常见方法

1. 滚动
   ```js
   const scrollBtn = document.querySelector("#scroll");
   scrollBtn.onclick = function () {
     window.scrollTo({ top: 2000 });
   };
   ```
2. 关闭 `window.close()`
3. 打开某个窗口 `window.open("https://www.baidu.com", "_self")`
4. 监听 和 移除监听

   ```js
   const clickHander = () => {
     console.log("window 发生了点击");
   };

   window.addEventListener("click", clickhandler); // 添加监听事件

   window.removeEventListener("click", clickhandler); // 移除监听
   ```

5. 派发事件 dispatch
   ```js
   window.addEventListener("coderwhy", () => {
     console.log("监听到了 coderwhy 事件");
   });
   window.dispatchEvent(new Event("coderwhy"));
   ```

#### 2.3.3 常见事件

1. onfocus
2. onblur
3. onhashchange：监听哈希改变
   ```js
   location.hash = "aaa"; // 会被监听到
   ```

#### 2.3.4 location 的常见属性和事件

> location 即 window.location

- 属性

  1. href：当前完整 url 地址
  2. hash：`#` 后的
  3. pathname：端口后 到 `#` 前
  4. origin：网址 + 端口号
  5. protocol：协议
  6. port
  7. search

- 方法

  1. assign(url)：可回退
  2. replace(url)：不可回退
  3. reload(boolean)：true -> 强制加载，从服务器请求新资源；false -> 从缓存加载

#### 2.3.5 history 对象常见属性和方法

- history 对象允许我们访问浏览器曾经的会话历史记录
- 有两个属性：

  1. length：会话中的记录条数
  2. state：当前保留的状态值

- 五个方法

  1. `back()` == `history.go(-1)`
  2. `forward()` == `history.go(1)`
  3. `go()`
  4. `pushState()`：history.pushState({name: ''}, title, path)
     - title 被忽略，写 `""` 即可
     - 不请求新资源，前端路由会监听路由变化，去请求组件
     - `{name: ''}` 可以通过 `history.state` 获取
  5. `replaceState()`
