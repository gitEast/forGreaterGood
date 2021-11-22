<!--
 * @Author: your name
 * @Date: 2021-11-05 15:43:23
 * @LastEditTime: 2021-11-21 15:22:05
 * @LastEditors: Please set LastEditors
 * @Description: v-model 和 注册 Vue 组件
 * @FilePath: \vue3\05-v-model_register.md
-->

# v-model 和 注册 Vue 组件

## v-model

### v-model 用途

- 表单提交是开发中非常常见的功能，也是用户交互的重要手段

  1. v-model 可以在表单 input、textarea 以及 select 元素上创建双向数据绑定
  2. 它会根据控件类型自动选取正确的方法来更新元素
  3. v-model 本质上是一种**语法糖**，**负责监听用户的输入事件来更新数据**，并在某种极端场景下进行一些特殊的处理

     ```html
     <template>
       <input :value="message" @input="inputChange" />
     </template>

     <script>
       export default {
         data() {
           return {
             message: "hello",
           };
         },
         methods: {
           inputChange(event) {
             this.message = event.target.value;
           },
         },
       };
     </script>
     ```

## 注册 Vue 组件

### 组件

- createApp 函数传入了一个对象 App，这个对象本质上就是一个组件，也是我们应用程序的**根组件**
- 组件化提供了一种抽象，让我们可以开发出一个个**独立可复用的小组件**来构造我们的应用
- 任何应用都会被抽象成一棵**组件树**

### 组件注册

- 全局组件注册

  ```html
  <template id="my-app">
    <h2>我是标题</h2>
    <p>我是内容，哈哈哈</p>
    <component-a />
  </template>

  <script src="url"></script>
  <script>
    const App = {
      template: "#my-app",
    };

    const app = Vue.createApp(App);
    // 使用 app 注册一个全局组件
    app.component("component-a", {
      template: `<h2>我是 component A 组件</h2>`,
    }); // 参数：组件名称，组件对象
    app.mount("#my-app");
  </script>
  ```

  - 此时即使该组件没有使用，也会被打包 --> 会增加包的大小，造成浪费

- 局部组件注册

  ```html
  <template id="my-app">
    <h2>我是标题</h2>
    <p>我是内容，哈哈哈</p>
    <component-a />
  </template>

  <script src="url"></script>
  <script>
    const App = {
      template: '#my-app',
      components: {
        'component-a': {
          template: `<h2>我是 component A 组件</h2>`
        }
      }
    }

    const app = Vue.createApp(App)
    app.mount('#my-app')
  </script>
  </script>
  ```
