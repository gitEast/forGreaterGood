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

#### 1.2.4 书籍购物车案例

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

      1. `bind` 绑定
      2. ES6 class fields 语法

         ```jsx
         class App extends React.Component {
           btnClick = () => {
             console.log(this);
           };

           render() {
             return (
               <div>
                 <button onClick={this.btnClick}>按钮</button>
               </div>
             );
           }
         }
         ```

      3. 箭头函数：`<button onClick={() => this.btnClick()}></button>`

    - 参数绑定

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
4. 条件渲染

### 2.3 转换过程(JSX -> JS)

`div` -> `React.createElement('div', props, ...children)`

- jsx 仅仅只是 `React.createElement` 函数语法糖
  - `type`
    - 标签元素 or 组件元素
  - `config` 即 `props`
    - 所有 jsx 中的属性都在 config 中以对象的属性和值的形式存储
  - `children`
    - 存放在标签中的内容，以 children 数组的方式进行存储

### 2.4 虚拟 DOM

jsx 代码 -> ReactElement 对象 -> 真实 DOM

- 虚拟 DOM 的特点
  - 会在 新旧 DOM 之间进行 diff 算法，来决定哪些东西更新 or 不更新
  - 跨平台
    - 每一个 虚拟 DOM 都是一个 js 对象，所以可以渲染成 Web DOM、iOS/Android 控件
  - 声明式编程
- 官方说法：Virtual DOM 是一种编程理念
  - 在这个理念中，UI 以一种**理想化**或者说**虚拟化**的方式保存在内存中，并且它是一个相对简单的 JavaScript 对象
  - 可以通过 `root.render` 让 虚拟 DOM 和 真实 DOM 同步起来，这个过程叫做 协调 Reconciliation

## 三、React 脚手架

### 3.1 认识脚手架工具

- 前端工程的复杂化
  - 目录结构的组织划分
  - 管理文件之间的相互依赖
  - 管理第三方模块的依赖
  - 项目发布前如何压缩、打包项目
  - ...
- 为了解决上面这些问题
  - 需要学习：babel, webpack, gulp, 配置它们的转换规则、打包依赖、热更新等
  - 脚手架的出现，就是为了帮助我们解决这一系列的问题
    - 常见脚手架
      - Vue: @vue/cli
      - Angular: @angular/cli
      - React: create-react-app 即 CRA
    - 作用：帮助生成一个通用的目录结构，并且配置好所需的工程环境
    - 电脑上的 Node 环境 -> webpack

### 3.2 create-react-app

`npm install create-react-app -g`

`create-react-app --version`

### 3.3 创建 React 项目

#### 3.3.1 创建项目

`create-react-app [项目名称]`

`cd [项目名称]`

`npm start`

#### 3.3.2 目录结构

- node_modules
  - 第三方包
- public
  - favicon.ico 网站图标
  - index.html
  - logoXXX.png logo 文件
  - manifest.json: 配置 logo
    - PWA: Progressive Web App Support 渐进式 WEB 应用
      - 定义
        - 一个 PWA 应用首先是一个网页，可以通过 Web 技术编写出一个网页应用
        - 然后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能
          - App Manifest
            - Android：网页在桌面安装图标
          - Service Worker
            - 离线缓存
        - 这种 Web 存在的形式，也称之为是 Web App
      - 解决的问题
        1. 添加至主屏幕，点击主屏幕图标可以实现启动动画以及隐藏地址栏
        2. 实现离线缓存功能，即使用户手机没有网络，依然可以使用一些离线功能
        3. 实现消息推送
        4. ...等等一系列类似于 Native App 相关的功能
    - 公司一般用不到
  - robots.txt
    - 被爬取的数据配置
- src
  - index.js
    - 编写 React 代码，通过 React 渲染对应的内容
  - App.jsx: 组件
  - reportWebVitals.js: 发送一些包
  - setupTest.js: 单元测试
- .gitignore
- package-lock.json
  - 第三方依赖的真实版本
- package.json
  - 项目信息
  - 第三方依赖信息
  - 脚本命令
- README.md

### 3.4 webpack 的配置

在 node_modules/react-scripts/config/webpack.config.js 里

- 在项目中显示 webpack 配置
  - `npm run eject`
    - 新增 config 文件夹
    - 新增 scripts 文件夹
      - scripts/bulid.js
      - scripts/start.js
      - scripts/test.js
  - **注意：不可逆**

## 四、React 组件化开发（一）

### 4.1 React 的组件化

- 分类
  1. 根据组件的定义方式
     - 函数组件 Functional Component
     - 类组件 Class Component
  2. 根据组件内部是否有状态需要维护
     - 无状态组件 Stateless Component
     - 有状态组件 Stateful Component
  3. 根据组件的不同职责
     - 展示型组件 Presentational Component
       - 只展示内容
     - 容器型组件 Container Component
       - 多种功能：维护状态、发送网络请求、...
  - 主要关注数据逻辑和 UI 展示的分离
    - 函数组件、无状态组件、展示型组件主要关注 UI 的展示
    - 类组件、有状态组件、容器型组件主要关注数据逻辑

#### 4.1.1 类组件

- 要求
  1. 组件名称大写字母开头
  2. 需要继承自 React.Component
  3. 必须实现 render 函数
- render 方法的返回值：jsx 语法
  - React 元素
    - 通过 jsx 语法编写的代码会被编译成 React.createElement，所以返回的就是一个 React 元素
  - 组件或者 fragments
  - Portals
  - 字符串 or 数值类型
  - 布尔类型 or null or undefined
    - 不显示内容

快捷命令：`r + c + e`

#### 4.1.2 函数组件

- return 的值 与 类组件 render 函数返回值一致

  ```jsx
  function App() {
    return <h2>App Functional Component</h2>;
  }

  export default App;
  ```

- 与类组件相比的特点(无 hook 情况下)
  - 没有生命周期
  - 没有 `this` 关键字
    - 无 `this.state`, `this.setState()` 等用法
  - 没有内部状态

### 4.2 React 组件生命周期

- 生命周期
  - 事物创建到销毁的整个过程，被称为是 **生命周期**
  - React 组件也有自己的生命周期 -> 了解组件的生命周期，可以在最合适的地方完成自己想要的功能
  - 生命周期是一个抽象的概念，在其整个过程中，分成了很多个阶段
- 生命周期函数
  | 阶段 | 函数 | 具体调用时期 |
  | --- | ---- | ------ |
  | 装载阶段 Mount | componentDidMount | 组件第一次在 DOM 树中被渲染的过程 |
  | 更新过程 Update | ComponentDidUpdate | 组件状态发生变化，重新更新渲染的过程 |
  | 卸载过程 Unmount | componentWillUnmount | 组件从 DOM 树中被移除的过程 |
- 实例创造过程
  1. 执行构造方法 constructor
     - if 不初始化 state or 不进行方法的绑定，不需要实现 constructor 方法
     - 通常只做两件事
       1. 通过给 `this.state` 赋值对象来初始化内部的 state
       2. 为事件绑定实例`this`
  2. `getDerivedStateFromProps()`
     - 如果初始化的 state 需要依赖于 props
  3. 执行 render 方法
  4. `shouldComponentUpdate()`
     - 返回值
       - `true`: 执行 render 函数
       - `false`: 不执行 render 函数
     - 可用于性能优化
  5. `getSnapshotBeforeUpdate()`
     - 在 React 更新 DOM 之前回调的一个函数
     - 用于保存数据
       - 如 获取 DOM 更新前的一些数据(滚动位置...)
  6. 挂载 mount (componentDidMount)
     - 时机：在组件挂载后(插入 DOM 树中)立即调用
     - 推荐在此处进行的操作
       - 依赖于 DOM 的操作可以在这里进行
       - 发送网络请求
       - 添加一些订阅(需要在 componentWillUnmount 取消订阅)
  7. 更新 update (`componentDidUpdate(prevProps, prevState, snapshot)`)
     - 更新后会被立即调用，首次渲染不执行
  8. 卸载 unmount (componentWillUnmount)
     - 执行必要的清理操作

### 4.3 React 组件间的通信

#### 4.3.1 嵌套关系

- 组件之间存在嵌套关系
  - 组件化 ![组件嵌套关系](./imgs/%E7%BB%84%E4%BB%B6%E5%B5%8C%E5%A5%97%E5%85%B3%E7%B3%BB.png)
    1. 对组件进行拆分，拆分成一个个小的组件；
    2. 再将这些组件组合嵌套在一起，最终形成应用程序。

#### 4.3.2 parent 与 child 通信

- parent -> child

  - parent: `属性=值` 的形式传递给 child 组件
    ```jsx
    <MainBanner banners={banners} />
    ```
  - child: `props` 参数

    ```jsx
    class MainBanner extends Component {
      constructor(props) {
        super(props);
      }

      render() {
        const { banners } = this.props;
      }
    }
    ```

- child -> parent
  - 见 `./03_learn_component/src/05_组件通信child-parent`
- 参数 propTypes

  - 作用：类型限制

  ```jsx
  import PropTypes from 'prop-types';

  MainBanner.defaultProps = {
    banners: []
  };

  MainBanner.propTypes = {
    banners: PropTypes.array.isRequired
  };
  ```

### 4.4 React 组件插槽用法

- 方案实现

  1. 组件的 child 元素
     - 见 `./03_learn_component/src/07_组件插槽-child`
     - 注意：传入多个时 `this.props.children` 才是数组，一个时是该 React 对象
  2. props 属性传递 React 元素

     ```jsx
     <NavBar leftSlot={<h2>1111</h2>} />;

     const { leftSlot } = this.props;
     ```

### 4.5 React 非 parent-child 的通信

#### 4.5.1 Context

- 设计目的：共享那些对于一个**组件树**而言是“全局”的数据
  - 全局数据：当前认证的用户、主题、首选语言...
- 在组件之间共享此类值，而不必显式地通过组件树的逐层传递 props
- 使用方式：见 ``
  1. 创建上下文 `const [context] = React.createContext()`
  2. 上下文.Provider 包裹 child 元素
     - 需要提供的数据 `value={}`
  3. 在后代元素中拿取
     - 类组件
       1. 设置组件的 contextType 为某一个 Context: `[DescendantComponent].contextType = [context]`
       2. 从 `this.context` 拿取
     - 函数组件
       - 使用 `<ThemeContext.Consumer>{value => ...}</ThemeContext.Consumer>`
  4. 使用多个 Context
     - 使用 `[Context].Consumer` 进行嵌套

#### 4.5.2 Event Bus

#### 4.5.3 redux

以后再说。

### 4.6 setState 的使用详解

- React 中没有数据劫持，通过 `setState()` 方法调用 `render()` 方法
  - `shouldComponentUpdate()` -> 可用于控制是否调用 `render()`
    - `PureComponent` 帮助判断数据是否真的改变 -> 真，更新组件；否则，不更新
- `setState()` 传入的参数
  - 第一个
    - 对象
    - 回调函数
      - 优点
        1. 编写新的 state 逻辑
        2. 会将之前的 state 和 props 传递进来
           - 该 state 为同步更新的 state
  - 第二个：回调函数
    - 在数据更新(合并)之后，获取到对应的结果执行一些逻辑代码
- 是异步调用

  - **选择异步的原因**
    1. 可以显著提升性能
       - if 每次调用 setState 都进行一次更新，那么意味着 render 方法会被频繁调用，界面重新渲染
       - 最好的办法应该是，获取到多个更新，之后**批量更新**
    2. 如果同步更新了 state，但还没执行 render 方法，那么 state 和 props 不能保持同步
       - because child 组件的 props 需要 parent 组件 render 传入
       - 当 state 和 props 不能保持一致时，会在开发中产生很多问题
  - React18 之前有时是 同步调用
    ```jsx
    setTimeout(() => {
      this.setState({ message: 'hello' });
      console.log(this.state.message);
    });
    ```
    - setTimeout 等回调
    - DOM 原生事件
  - React 18 之后强制同步

    ```jsx
    import { flushSync } from 'react-dom';

    flushSync(() => {
      this.setState({ message: 'hello' });
    });
    console.log(this.state.message);
    ```

    - flushSync 内部仍是批处理
