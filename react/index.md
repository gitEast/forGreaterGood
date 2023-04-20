# React

## 一、邂逅 React

### 1.1 介绍

- 用于构建用户界面的 JavaScript 库
  - A JavaScript library for building user interfaces.
- [官方文档](https://react.docschina.org/)
- 技术特点
  1. 由 Meta(Facebook) 来更新维护，是大量优秀程序员的思想结晶
     - 普通开发工程师对其的认可
     - 大量流行的其他框架借鉴 React 的思想
  2. 声明式编程
     - 目前整个大前端开发最流行的模式
  3. 组件式开发
  4. 一次学习，跨平台编写
     - Web 端
     - React Native -> 移动端
     - 使用 Node 进行服务器渲染
     - ReactVR -> 虚拟现实 Web 应用程序

### 1.2 入门初尝试

初始文本 “Hello World”，点击按钮“改变文本”后，改为“Hello React”

1. 添加依赖 —— 三个依赖包
   - react：包含 react 所必须的核心代码
   - react-dom：react 渲染在不同平台所需要的核心代码(渲染过程)
     - web 端：react-dom 会将 jsx 最终渲染成真实的 DOM，显示在浏览器中
     - native 端：react-dom 会将 jsx 最终渲染成原生的控件(比如 Android 的 Button，iOS 的 UIButton)
   - babel：将 jsx 转换成 JavaScript 代码
     - 使用 jsx 时：`<script type="text/babel"></script>`
2. 编写 React 代码

   1. 根元素：`<div id="root"></div>`
   2. 渲染 Hello World
      - React18 之前：`ReactDOM.render(<h2>Hello World</h2>, document.querySelector('#root'))`
      - React18 之后：
        ```js
        const root = ReactDOM.createRoot(document.querySelector('#root'));
        root.render(<h2>Hello World</h2>);
        ```
   3. 完整流程

      ```js
      const root = ReactDOM.createRoot(document.querySelector('#root'));

      // 将文本定义成变量
      let message = 'Hello World';

      // 监听按钮的点击
      function btnClick() {
        // 修改数据
        message = 'Hello React';

        // 重新渲染界面
        rootRender();
      }

      rootRender();

      function rootRender() {
        root.render(
          <div>
            <h2>{message}</h2>
            <button onClick={btnClick}>修改文本</button>
          </div>
        );
      }
      ```

   4. 类组件优化

      ```js
      class App extends React.Component {
        // 组件数据
        constructor() {
          super();

          this.state = {
            message: 'Hello World'
          };
        }
        
        // 组件方法
        // 渲染内容 render 方法
        render() {
          return (
            <div>
              <h2>{this.state.message}</h2>
              <button>修改文本</button>
            </div>
          );
        }
      }

      // 将组件渲染到界面上
      const root = ReactDOM.createRoot(document.querySelector('#root'));
      root.render(<App />);
      ```

### 1.3 一些总结与定义

- 组件化
  - 数据依赖
    - 参与界面更新的数据
      - 又称 参与数据流
      - 定义在当前对象的 `state` 中
      - 调用 `this.setState` 方法更新数据，并通知 React 进行 update 操作
        - update 操作时会重新调用 render 函数
    - 不参与界面更新的数据
