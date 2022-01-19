<!--
 * @Author: East
 * @Date: 2022-01-13 17:10:23
 * @LastEditTime: 2022-01-19 22:22:16
 * @LastEditors: Please set LastEditors
 * @Description: 1. js 历史回顾
                 2. js 是什么
                 3. js 与 ECMAScript 的关系
                 4. JavaScript 的不同版本
 * @FilePath: \forGreaterGood\javascript\js红宝书4\1-什么是JavaScript.md
-->

# 什么是 JavaScript？

- 1995 年，JavaScript 问世。
- 当时用于替代 Perl 等服务器端语言**处理输入验证**
- 要真正学好用好 JavaScript，理解其**本质、历史及局限性**是非常重要的

## 1. 简短的历史回顾

> 随着 Web 日益流行，对客户端脚本语言的需求也越来越强烈。

### 1.1 历史前提

- 使用 28.8k bits/s 的调制解调器上网
- 网页变得越来越大、越来越复杂
- 验证简单的表单，需要大量与服务器的往返通信

--> 于是 网景公司将**开发一个客户端脚本语言来处理这种简单的数据验证**提上了日程 -- Brendan Eich

### 1.2 神仙打架

1. 网景公司在 Netscape Navigation 2 发布了 JavaScript 1.0，非常成功。
2. Netscape Navigation 3 中发布 JavaScript 1.1。
3. Netscape Navigation 3 发布后不久，微软发布了 IE 3，其中包含自己名为 JScript 的 JavaScript 实现。
4. 1996 年 8 月，微软重磅进入 Web 浏览器领域。

--> 这意味着出现了两个版本的 JavaScript。但 JavaScript 还**没有规范其语法或特性的标准**，这两个版本的并存让这个问题更加突出。

### 1.3 标准的出现

1. 1997 年，JavaScript 1.1 作为提案被提交给欧洲计算机制造商协会(Ecma)。第 39 技术委员会(TC39)承担了**“标准化一门通用、跨平台、厂商重力的脚本语言的语法和语义”**的任务。
   - 成员来自 网景、Sun、微软、Borland、Nombas 和其他对这门脚本语言有兴趣的公司的工程师
2. 数月后，名为 ECMA-262(即 ECMAScript) 的脚本语言标准被打造完成
3. 1998 年，国际标准化组织(ISO) 和 国际电工委员会(IEC) 也将 ECMAScript 采纳为标准(ISO/IEC-16262)
4. 自此以后，各家浏览器均以 ECMAScript 作为自己 JavaScript 实现的依据，虽然具体实现各有不同。

## 2. JavaScript 实现

完整的 JavaScript 实现包含以下几个部分：![JavaScript 组成部分](imgs/1-js组成部分.png)

- 核心 ECMAScript
- 文档对象模型 DOM
- 浏览器对象模型 BOM

1. 核心 ECMAScript
   - ECMA-262 将这门语言作为一个基准来定义，以便在它之上 再构建 更稳健的脚本语言
   - **宿主环境(host environment)**
     - ECMAScript 实现 可能存在的 宿主环境
       1. Web 浏览器
       2. Node.js
       3. Adobe Flash(已被淘汰)
     - 提供
       1. ECMAScript 的基准实现
       2. 与环境自身交互必须的扩展
          - 扩展(比如 DOM)使用 ECMAScript 核心类型和语法，提供特定于环境的额外功能
   - 定义了的东西
     - 语法
     - 类型
     - 语句
     - 关键字
     - 保留字
     - 操作符
     - 全局对象
   - 版本更迭
     1. Ed1：Netscape JavaScript1.1 被删去浏览器特定代码 + 少量细微的修改 + 不支持 Unicode 标准 + 对象(如 Date 对象)与平台有关
     2. Ed2：编校
     3. Ed3：真正的更新 —— 字符串处理 + 错误定义 + 数值输出 + 正则表达式的支持 + <span style="background: green">支持新的控制语句(?)</span> + `try/catch` 异常处理
        - 标志着 ECMAScript 作为一门真正的编程语言的时代终于到来
     4. Ed4：彻底的修订，被抛弃
     5. Ed5：“ECMAScript 3.1” 提案被接受。厘清 Ed3 存在的歧义 + 增加新功能(原生地解析和序列化 JSON + 方便继承和高级属性定义地方法 + 新的增强 ECMAScript 引擎解释 + 严格模式)
     6. Ed6：俗称 ES6、ES2015、ES Harmony(和谐版)。正式支持 类 + 模块 + 迭代器 + 生成器 + 箭头函数 + Promise + Reflect + Proxy + 其他新的数据类型
     7. Ed7：`Array.prototype.includes` + 指数操作符
     8. Ed8：异步函数(async/await) + SharedArrayBuffer + Atomics API + `Object.values` + `Object.entries` + `Object.getOwnPropertyDescriptors` + 字符串填充方法 + 支持对象字面量最后的逗号
     9. Ed9：异步迭代 + 剩余和扩展属性(rest, ...args) + 一组新的正则表达式特性 + `Promise finally` + 模板字符串
     10. Ed10：`Array.prototype.flat` + `Array.prototype.flatMap` + 字符串前后填充 + `Object.fromEntries` + `Symbol.prototype.descriptor` 属性 + 明确 `Function.prototype.toString()` 的返回值 + 固定 `Array.prototype.sort()` 的顺序 + <span style="background: green">解决与 JSON 字符串兼容的问题(?)</span> + `catch` 子句的可选绑定
   - 符合性 conformance 实现(前两个重要，后两个无所谓)
     1. 支持 ECMA-262 中描述的所有“类型、值、对象、属性、函数，以及程序语法与语义”
     2. 支持 Unicode 字符标准
     3. 增加 ECMA-262 中未提及的“额外的类型、值、对象、属性和函数”
     4. 支持 ECMA-262 中没有定义的“程序和正则表达式语法”(允许修改和扩展内置的正则表达式特性)
     - 总而言之，这些条件为 实现 开发者 基于 ECMAScript 开发语言提供了极大的**权限和灵活度**
   - 浏览器对 ECMAScript 的支持
