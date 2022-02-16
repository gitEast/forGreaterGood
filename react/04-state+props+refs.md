<!--
 * @Author: East
 * @Date: 2022-02-10 14:47:22
 * @LastEditTime: 2022-02-14 10:34:38
 * @LastEditors: Please set LastEditors
 * @Description: state + props + refs
 * @FilePath: \forGreaterGood\react\04-state+props+refs.md
-->

# 组件实例的三大核心属性：state + props + refs

## 一、state

- 组件
  - 简单组件 —— state 无
  - 复杂组件 —— state 有
- 理解
  - 对象：键值对
  - 组件被称为“**状态机**”，通过更新组件的 state 来更新对应的页面显示（重新渲染组件）
- 状态 state 不可直接更改，需要借助内置的 API —— setState 去更改

  ```js
  this.state.isHot = !this.state.isHot; // 错误的写法

  this.setState({ isHot: !isHot });
  ```

  - 更新操作 为 合并，而非替换
  - 简写形式

    ```js
    class Demo extends React.Component {
      state = { isHot: true };

      constructor(props) {
        super(props);
        // 强行绑定 this
        this.demo = this.demo.bind(this);
      }

      render() {
        const hot = "炎热";
        const notHot = "凉爽";
        const { isHot } = this.state;
        return (
          <h2 onClick={this.demo}>
            今天天气很{this.state.isHot ? hot : notHot}
          </h2>
        );
      }

      // 自定义方法
      demo = () => {
        const { isHot } = this.state;
        this.setState({ isHot: !isHot });
      };
    }
    ```

## 二、props

只读属性

### 2.1 基本使用

```js
class Demo extends React.Component {
  render() {
    return (
      <ul>
        <li>姓名：{this.props.name}</li>
        <li>性别：{this.props.gender}</li>
        <li>年龄：{this.props.age}</li>
      </ul>
    );
  }
}

ReactDOM.render(
  <Demo name="Tom" gender="女" age="18" />,
  document.getElementById("test")
);
```

- 可以通过解构赋值的方式简写 `const {name, gender, age} = this.props`
- 问题：
  1. 如果信息多了，需要写好多属性的键值对
     ```js
     const p = { name: "老刘", age: 30, gender: "女" };
     ReactDOM.render(<Demo {...p} />, document.getElementById("test"));
     ```

### 2.2 对 props 的值进行限制

#### 2.2.1 使用类式组件

```js
// 定义
Demo.propTypes = {
  name: PropTypes.string.isRequired,
  gender: PropTypes.string,
  age: PropTypes.number,
};

// 默认值
Demo.defaultProps = {
  name: "Tom",
  gender: "女",
  age: 18,
};

/* 写在类内部 */
class Demo extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    gender: PropTypes.string,
    age: PropTypes.number,
  };

  static defaultProps = {
    name: "Tom",
    gender: "女",
    age: 18,
  };
}
```

- 需要 prop-types.js 文件

#### 2.2.2 函数式组件

```js
function Demo(props) {
  return (
    <ul>
      <li>姓名：{props.name}</li>
      <li>性别：{props.gender}</li>
      <li>年龄：{props.age}</li>
    </ul>
  );
}

// 定义
Demo.propTypes = {
  name: PropTypes.string.isRequired,
  gender: PropTypes.string,
  age: PropTypes.number,
};

// 默认值
Demo.defaultProps = {
  name: "Tom",
  gender: "女",
  age: 18,
};
```

## 三、refs

### 3.1 ref

1. 需要做到的样子

   ```js
   class Demo extends React.Component {
     showData = () => {
       const input = document.getElementById("input1");
       alert(input.value);
     };

     render() {
       return (
         <div>
           <input type="text" id="input1" placeholder="点击按钮提示数据" />
           <button onClick={this.showData}>点我提示左侧的数据</button>
           <input type="text" placeholder="失去焦点提示数据" />
         </div>
       );
     }
   }

   // 2. 渲染组件到页面
   ReactDOM.render(
     <Demo name="Tom" gender="女" age="18" />,
     document.getElementById("test")
   );
   ```

2. 使用 `ref` 和 `refs`

   ```js
   class Demo extends React.Component {
     showData = () => {
       const { input1 } = this.refs;
       alert(input1.value);
     };

     showData2 = () => {
       const { input2 } = this.refs;
       alert(input2.value);
     };

     render() {
       return (
         <div>
           <input type="text" ref="input1" placeholder="点击按钮提示数据" />
           <button onClick={this.showData}>点我提示左侧的数据</button>
           <input
             type="text"
             ref="input2"
             onBlur={this.showData2}
             placeholder="失去焦点提示数据"
           />
         </div>
       );
     }
   }

   // 2. 渲染组件到页面
   ReactDOM.render(
     <Demo name="Tom" gender="女" age="18" />,
     document.getElementById("test")
   );
   ```

### 3.2 refs 的新写法

- 过时的 API: `String` 类型的 `Refs`
  - 不推荐使用，有问题
    1. 存在效率问题

#### 3.2.1 回调函数形式的 ref

- 推荐使用 回调函数形式的 ref

  ```js
  class Demo extends React.Component {
    showData2 = () => {
      const { input2 } = this;
      alert(input2.value);
    };
  }

  render() {
    return (
      <input
        type="text"
        ref={(currentNode) => {
          this.input2 = currentNode;
        }}
        onBlur={this.showData2}
        placeholder="失去焦点提示数据"
      />;
    )
  }
  ```

- 回调函数的调用次数

  ```js
  class Demo extends React.Component {
    showInfo = () => {
      const { input1 } = this;
      alert(input1.value);
    };

    render() {
      return (
        <div>
          <input
            ref={(currentNode) => {
              this.input1 = currentNode;
              console.log("@", currentNode);
            }}
            type="text"
          />
          <button onClick={this.showInfo}>点我提示输入的数据</button>
        </div>
      );
    }
  }

  ReactDOM.render(<Demo />, document.getElementById("test"));
  ```

  - 如果 `ref` 回调函数是以内联函数的方式定义的，在**更新**过程中，它会被执行两次
    1. 传入参数 `null`：为了避免上一次挂载内容造成影响，所以有一个清空的动作
    2. 传入参数 DOM 元素
    - 因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。
  - 如果定义成 class 的绑定函数，可以避免上述问题。但是大多数情况下它是无关紧要的

    ```js
    class Demo extends React.Component {
      showInfo = () => {
        const { input1 } = this;
        alert(input1.value);
      };

      saveInput = (currentNode) => {
        this.input1 = currentNode;
      };

      render() {
        return (
          <div>
            {/* 注释写法
              <input
                ref={(currentNode) => {
                  this.input1 = currentNode;
                  console.log("@", currentNode);
                }}
                type="text"
              />
            */}
            <input ref={this.saveInput} type="text" />
            <button onClick={this.showInfo}>点我提示输入的数据</button>
          </div>
        );
      }
    }

    ReactDOM.render(<Demo />, document.getElementById("test"));
    ```

#### 3.2.2 createRef 的使用

React.createRef 调用后可以返回一个容器，该容器可以存储被 ref 所标识的节点

```js
class Demo extends React.Component {
  myRef = React.createRef();

  showInfo = () => {
    const { current } = this.myRef;
    alert(current.value);
  };

  render() {
    return (
      <div>
        <input ref={this.myRef} type="text" />
        <button onClick={this.showInfo}>点我提示输入的数据</button>
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById("test"));
```
