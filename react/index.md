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

### 1.2 初尝试

#### 1.2.1 改变文本

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

   4. 类组件优化 1.0

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

   5. 类组件优化 2.0

      ```js
      class App extends React.Component {
        // 组件数据
        constructor() {
          super();
          this.state = {
            message: 'Hello World'
          };

          // 对需要绑定的方法，提前绑定好 this
          this.btnClick = this.btnClick.bind(this);
        }

        // 组件方法(实例方法)
        btnClick() {
          // 内部完成了两件事情：1. 将 state 中的 message 修改；2. 自动重新执行 render 函数
          this.setState({
            message: 'Hello React'
          });
        }

        render() {
          return (
            <div>
              <h2>{this.state.message}</h2>
              <button onClick={this.btnClick}>修改文本</button>
            </div>
          );
        }
      }

      const root = ReactDOM.createRoot(document.querySelector('#root'));
      root.render(<App />);
      ```

#### 1.2.2 循环

电影列表

```js
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: ['非分熟女', '千机变', '双子神偷', '精武家庭']
    };
  }

  render() {
    return (
      <div>
        <h2>电影列表</h2>
        <ul>
          {this.state.movies.map((movie) => (
            <li>{movie}</li>
          ))}
        </ul>
      </div>
    );
  }

  const root = ReactDOM.createRoot(document.querySelector('#root'))
  root.render(<App />)
}
```

#### 1.2.3 计数器案例

```js
const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      counter: 100
    };
  }

  increament() {
    const { counter } = this.state;
    this.setState({
      counter: counter++
    });
  }

  decreament() {
    const { counter } = this.state;
    this.setState({
      counter: counter--
    });
  }

  render() {
    return (
      <div>
        <h2>counter: {this.state.counter}</h2>
        <div>
          <button onClick={() => increment()}> +1 </button>
          <button onClick={() => decrement()}> -1 </button>
        </div>
      </div>
    );
  }
}
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
  - 事件绑定
    - 注意 `this` 的绑定
      - 类中独立函数调用，`this` 指向 `undefined`

## 二、JSX

### 2.1 认识 JSX

- JSX 是什么？
  - 一种 JavaScript 的语法扩展，也在很多地方被称为 JavaScript XML(看起来就是一段 XML 语法)
  - 用于描述 UI 界面，完全可以和 JavaScript 融合在一起使用
  - 不同于 Vue 中的模板语法，不需要专门学习一些特定的指令(v-for, v-if, v-else...)
- Why React choose JSX?
  - React 认为渲染逻辑本质上与其他 UI 逻辑存在内在耦合
    - for examples
      1. UI 需要绑定事件
      2. UI 需要展示数据状态
      3. 某些状态发生改变时，需要改变 UI
    - so 与其分开，不如在组件(Component)里组合它们

### 2.2 基本语法

1. 注释：注意括号
   ```jsx
   {
     /* */
   }
   ```
2. 插入内容(作为元素内容)

   1. 当变量是 Number, String, Array 类型时，可以直接显示
   2. 当变量是 null, undefined, Boolean 类型时，内容为空

      - 如果希望可以显示 null, undefined, Boolean 类型，那么需要转成字符串

        ```js
        const aaa = undefined;
        const bbb = null;
        const ccc = true;

        console.log(String(aaa)); // 'undefined'
        console.log(bbb + ''); // 'null'
        console.log(ccc.toString()); // 'true'
        ```

   3. Object 对象类型不能作为子元素(not valid as a React child)

3. 绑定属性
   - 基本属性
   - `class`:
     - `<div className={className}></div>`
     - 第三方库 classnames
   - `style`: `<div style={{fontSize: '16px'}}></div>`
