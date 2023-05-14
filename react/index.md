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

## 五、React 组件开发（二）

### 5.1 React 性能优化 SCU

#### 5.1.1 React 更新机制

- 渲染流程
  - JSX -> 虚拟 DOM -> 真实 DOM
- 更新流程
  - props/state 改变 -> render 函数重新执行 -> 产生新的 DOM 树 -> 新旧 DOM 树进行 diff -> 计算出差异进行更新 -> 更新到真实的 DOM
- diff 算法
  - if 进行完全比较，则时间复杂度为 O(n^2) -> 开销过于昂贵，React 的更新性能会变得非常低效
  - 优化至 O(n)
    1. 同层节点之间相互比较，不会跨节点比较
    2. 不同类型的节点，产生不同的树结构
    3. 开发中，可以通过 key 来指定哪些节点在不同的渲染中保持稳定
       - 在最后位置插入数据 -> 意义不大
       - 注意事项
         1. key 唯一
         2. 不要使用随机数(if 使用随机数，下一次 render 时，会重新生成一个数字)
         3. 使用 index 作为 key，对性能没有优化

#### 5.1.2 SCU 优化

- `shouldComponentUpdate()`
  - 简称 SCU
  - 参数
    1. `nextProps`
    2. `nextState`
  - 根据返回值 true/false 判断是否重新调用 render 方法
- 类组件
  - PureComponent
    - 出现的原因：
      - if 每个变化都需要在 `shouldComponentUpdate()` 中进行判断 -> 烦死了烦死了(孙悟空.gif)
    - 将 `class` 继承自 `PureComponent` 帮助实现上述判断
    - **浅层比较**
      - 只比较第一层，不比较深层
  - 内部原理：
    1. 给原型加上 `isPureComponent = true` => 当为 pureComponent 时，进入 `shallowEqual(newValue, oldValue)` 函数
    2. 比较 newVal 和 oldValue 是否为同一个对象：地址，keys.length， key-value
- 函数组件

  - 使用 `memo()`

    ```jsx
    import { memo } from 'react';

    const Profile = memo(function (props) {
      console.log('profile render');
      return <h2>Profile: {props.message}</h2>;
    });

    export default Profile;
    ```

### 5.2 获取 DOM/组件 方式

#### 5.2.1 获取 DOM

- `this.refs.xxx`

  ```jsx
  import { PureComponent } from 'react';

  class App extends PureComponent {
    getNativeDOM() {
      console.log(this.refs.hello);
    }

    render() {
      return (
        <div>
          <h2 ref="hello">Hello World</h2>
          <button onClick={(e) => this.getNativeDOM()}>获取DOM</button>
        </div>
      );
    }
  }
  ```

- `createRef()`

  ```jsx
  import { PureComponent, createRef } from 'react';

  class App extends PureComponent {
    constructor() {
      super();

      this.helloRef = createRef();
    }

    getNativeDOM() {
      console.log(this.helloRef.current);
    }

    render() {
      return (
        <div>
          <h2 ref={this.helloRef}>Hello World</h2>
          <button onClick={(e) => this.getNativeDOM()}>获取DOM</button>
        </div>
      );
    }
  }
  ```

- 渲染完毕属性自动回调函数(开发中推荐)

  ```jsx
  import { PureComponent } from 'react';

  class App extends PureComponent {
    constructor() {
      super();

      this.helloEl = createRef();
    }

    getNativeDOM() {
      console.log(this.helloEl);
    }

    render() {
      return (
        <div>
          <h2 ref={(el) => (this.helloEl = el)}>Hello World</h2>
          <button onClick={(e) => this.getNativeDOM()}>获取DOM</button>
        </div>
      );
    }
  }
  ```

#### 5.2.2 获取组件实例

```jsx
import { PureComponent, createRef, forwardRef } from 'react';

class HelloWorld extends PureComponent {
  test() {
    console.log('test');
  }

  render() {
    return <h2>Hello World</h2>;
  }
}

const HelloWorldFunc = forwardRef(function (props, ref) {
  render() {
    return <h2 ref={ref}>Hello World</h2>;
  }
});

class App extends PureComponent {
  constructor() {
    super();

    this.hwRef = createRef();
  }

  getComponent() {
    console.log(this.hwRef.current);
    this.hwRef.current.test();
  }

  render() {
    return (
      <div>
        <HelloWord ref={this.hwRef} />
        <button onClick={(e) => this.getComponent()}>获取DOM</button>
      </div>
    );
  }
}
```

### 5.3 受控和非受控组件

表单元素一旦绑定 `value`(state 中的值)，立即变成受控组件；否则为非受控组件

#### 5.3.1 受控组件

- 详细解释
  - 在 HTML 中，表单元素通常自己维护 state，并根据用户输入进行更新(浏览器操控)
  - 而在 React 中，可变状态(mutable state) 通常保存在组件的 state 属性中，并且只能通过 `setState()` 更新
  1. 将两者结合起来，使 React 的 state 称为 **唯一数据源**
  2. 渲染表单的 React 组件还控制着用户输入过程中表单发生的操作
  3. 被 React 以这种方式控制取值的表单输入元素，就叫做 **“受控组件”**
- 案例：见 `./code/03_learn_component/src/15_受控和非受控组件/App.jsx`
  1. `input`
  2. `checkbox` 多选
  3. `select` 多选

#### 5.3.2 非受控组件

通过 `ref` 获取非受控组件的值——即，操作 DOM

### 5.4 React 的高阶组件

- 定义
  - Higher-Order Components，简称 HOC
  - 高阶组件是参数为组件，返回值为新组件的函数
- 特点
  - 对参数组件做了一层**拦截(增强)**
    1. props
    2. context
    3. 鉴权
    4. 生命周期
- 一种设计模式
  - 高阶组件并不是 React API 的一部分，而是基于 React 的组合特性而形成的设计模式
  - 在一些 React 第三方库中比较常见
    - redux 中的 connect
    - react-router 中的 withRouter
- 编写模板

  ```jsx
  function higherOrderComponent(WrapperComponent) {
    class NewComponent extends PureComponent {
      render() {
        return <WrapperComponent />;
      }
    }

    // 改变组件的名字
    NewComponent.displayName = 'Coderwhy';

    return NewComponent;
  }
  ```

  - 见 `./code/03_learn_component/src/16_React高阶组件`

- 组件之间的复用方式
  - Mixin：早期 React 提供，目前已不再建议使用
    1. Mixin 可能会相互依赖、相互耦合，不利于代码维护
    2. 不同的 Mixin 中的方法可能会相互冲突
    3. Mixin 非常多时，组件处理起来比较麻烦，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性
  - HOC 的缺陷
    1. 需要在原组件上进行包裹 or 嵌套，如果大量使用 HOC，会产生非常多的嵌套，使调试变得困难
    2. HOC 可以劫持 props，在不遵守约定的情况下可能造成冲突
  - Hooks 的出现是开创性的，解决了很多 React 之前存在的问题

### 5.5 portals 和 fragment

```html
<body>
  <div id="App"></div>
  <div id="east"></div>
</body>
```

```jsx
import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';

export class App extends PureComponent {
  render() {
    return (
      <div className="app">
        <h1>App</h1>
        {createPortal(<h2>App H2</h2>, document.querySelector('#east'))}
      </div>
    );
  }
}

export default App;
```

- 可用于 Modal

#### 5.5.2 fragment

```jsx
import { PureComponent, Fragment } from 'react';

export class App extends PureComponent {
  render() {
    return (
      <Fragment>
        <h2>我是 App 的标题</h2>
        <p>我是 App 的内容</p>
      </Fragment>
    );
  }
}

export default App;
```

- 多个根
- `Fragment` 不渲染

### 5.6 StrictMode 模式

- 一个用来突出显示应用程序中潜在问题的工具
  1. 与 `Fragment` 一样，`StrictMode` 不会渲染任何可见的 UI
  2. 它为其后代元素触发额外的检查和警告
  3. 严格模式检查仅在开发模式中运行，不会影响生产构建
- 严格模式检查
  1. 识别不安全的生命周期
  2. 使用过时的 ref API
  3. 检查意外的副作用
     - 组件的 `constructor` 会被调用两次
     - 严格模式下故意进行的操作，查看是否会产生副作用
  4. 使用废弃的 `findDOMNode` 方法
  5. 检测过时的 context API

```jsx
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('#root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## 六、React 的过渡动画

### 6.1 过渡动画

> React 社区提供 `react-transition-group` 用于过渡动画

- 安装
  - `npm install react-transition-group --save`
- 包含四个组件
  - Transition
    - 与平台无关的组件(不一定要结合 CSS)
  - CSSTransition
    - 在前端开发中，通常使用 CSSTransition 来完成过渡动画效果
  - SwitchTransition
    - 两个组件的显示和隐藏切换时使用
  - TransitionGroup
    - 将多个动画组件包裹其中，一般用于列表中元素的动画

### 6.2 CSSTransition 使用

- 属性
  - `in: bool`: show or not
  - `className: string`: 自行编写的 CSS 动画样式
  - `timeout: number/object`
    - `{ appear: 500, enter: 1000, exit: 2000 }`
  - `unmountOnExit: bool`: 退出时卸载组件
  - `appear`: 是否在第一次出现时有动画
  - `nodeRef`: child 元素的 ref
    - 防止 `react-transition-group` 使用的过期 API 在严格模式下报错
- 状态
  - appear
    - 第一次出现时
  - enter
    - 进入
    - 动画流程：
      1. [className]-enter
      2. [className]-enter-active
      3. [className]-enter-done
  - exit
    - 动画流程：
      1. [className]-exit
      2. [className]-exit-active
      3. [className]-exit-done
- 钩子函数
  - `onEnter`：开始进入动画
  - `onEntering`: 正在执行进入动画
  - `onEntered`: 执行进入结束
  - `onExit`
  - `onExting`
  - `onExited`

### 6.3 SwitchTransition

- 使用场景
  - 有一个按钮在 on 和 off 之间切换，希望 on 先从左侧退出，off 再从右侧进入
    - vue 中为 `vue transition modes`

```jsx
import { SwitchTransition, CSSTransition } from 'react-transition-group';

<SwitchTransition mode="out-in">
  <CSSTransition
    key={isLogin ? 'exit' : 'login'}
    className="login"
    timeout={1000}
  >
    <button onClick={() => this.setState({ isLogin: !isLogin })}>
      {isLogin ? '退出' : '登录'}
    </button>
  </CSSTransition>
</SwitchTransition>;
```

### 6.4 TransitionGroup

- 属性
  - `component: string`: 包裹的标签类型

```jsx
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const { books } = this.state

<Transition component="ul">
  {
    books.map((book, index) => {
      return (
        <CSSTransition key={index} className="bookAdd" timeout={1000}>
          <li>{item.name}-{item.price}</li>
        </CSSTransition>
      )
    })
  }
</Transition>
```

## 七、编写 CSS 的方式

### 7.1 React 中 CSS 的概述

- 组件化
  - but CSS 的设计就不是为组件化而生的
  - 要求：
    1. 可以编写局部 CSS：具备自己的作用域，不会随意污染其他组件
    2. 可以编写动态的 CSS：可以获取当前组件的一些状态，根据状态的变化生成不同的 CSS 样式
    3. 支持所有的 CSS 特性：伪类、动画、媒体查询...
    4. 编写简洁，最好符合一贯的 CSS 风格特点
- 官方没有给出统一的样式风格
- 方案
  - 内联样式：小驼峰命名属性的 JavaScript 对象
    - 优点
      1. 样式之间不会有冲突
      2. 可以动态获取当前 state 中的状态
    - 缺点
      1. 写法上都需要使用小驼峰标识
      2. 某些样式没有提示
      3. 大量的样式，代码混乱
      4. 某些样式无法编写：伪类、伪元素...
  - 普通 CSS 文件
    - 缺点
      1. 全局样式，样式之间会相互层叠
  - CSS Module
    - 基于 webpack 配置的环境下都可以使用：webpack.config.js 中的 `modules: true`
  - CSS in JS
  - classnames 库
    - 安装：`npm install classnames`
- craco 库加载 less

  - 配置 webpack

  1. 安装：`npm install @craco/craco`
     - 注意版本支持
  2. package.json 修改
     ```json
     {
       "script": {
         "start": "craco start",
         "build": "craco build",
         "test": "craco test"
       }
     }
     ```
  3. 安装 craco-less 支持：`npm install craco-less`
  4. 创建文件 `craco.config.js`

     ```js
     const CracoLessPlugin = require('craco-less');

     module.exports = {
       plugins: [
         {
           plugin: CracoLessPlugin,
           options: {
             lessLoaderOptions: {
               lessOptions: {
                 modifyVars: { '@primary-color': '#1da57a' },
                 javascriptEnabled: true
               }
             }
           }
         }
       ]
     };
     ```

### 7.2 CSS in JS

- 通过 js 来为 CSS 赋予一些能力，包括类似于 CSS 预处理器一样的样式嵌套、函数定义、逻辑复用、动态修改状态等等
- 目前流行的 CSS-in-JS 库
  - `styled-components`
  - `emotion`
  - `glamorous`
- `styled-components` 使用

  1. 安装: `npm install styled-components`

- ES6 标签模板字符串

  1. 基本使用
     ```js
     const name = 'east';
     const age = 23;
     const str = `my name is ${name}, my age is ${age}`;
     ```
  2. 在函数中调用

     ```js
     function foo(...args) {
       console.log(args);
     }

     const name = 'east';
     const age = 23;
     foo(name, age, 'my name'); // ['east', 23, 'my name']
     foo`my name is ${name}, age is ${age}`; // [['my name is ', ', age is ', ''], 'east', 23]
     ```
