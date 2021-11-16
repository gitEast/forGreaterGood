<!--
 * @Author: East
 * @Date: 2021-11-15 14:52:15
 * @LastEditTime: 2021-11-16 09:47:26
 * @LastEditors: Please set LastEditors
 * @Description: vue-router 和 Vuex
 * @FilePath: \forGreaterGood\vue3\23-VueRouter和Vuex.md
-->
# vue-router 和 Vuex

## vue-router
+ `app.use(router)` --> `router.install()` -->
  ```js
  router.install = () => {
    app.component('router-link', ...)
    app.component('router-view', ...)
  }
  ```
### router-link
```vue
<template>
  <div>
    <router-link to="/home" v-slot="props">
      <button>首页</button>
    </router-link>
  </div>
</template>
```
+ props 中的属性
  - href：跳转的链接
  - route：路由对象 -- 默认情况下被标准化了
  - navigate：导航函数，自动导航
    ```vue
    <template>
      <div id="app">
        <router-link to="/home" v-slot="props" custom>
          <button @click="props.navigate">首页</button>
        </router-link>
      </div>
    </template>
    ```
  - isActive：是否处于活跃状态，true or false
  - isExactActive：是否处于精确活跃状态

### router-view
+ 动画
  ```vue
  <template>
    <router-view v-slot="props">
      <transition name="why">
        <keep-alive>
          <component :is="props.Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </template>
  ```

### 动态添加路由
+ `router.addRoute({ path: url, component: Component})`
+ 实际应用
  ```js
  const categoryRoute = {
    path: '/category',
    component: () => ('../Category.vue')
  }

  // 添加顶级路由对象
  router.addRoute(categoryRoute)
  // 添加二级路由对象
  router.addRoute('home', categoryRoute)
  ```

### 动态删除路由
+ 添加一个 name 相同的路由：path 和 component 不同
+ removeRoute：`router.removeRoute('about')`
+ addRoute 方法的返回值回调
  ```js
  const removeRoute = router.addRoute(categoryRoute)
  removeRoute()
  ```

### 其他方法
+ router.hasRoute()：检查路由是否存在
+ router.getRoutes()：获取一个包含所有路由记录的数组

### 路由导航守卫
> vue-router 提供的导航守卫主要用于通过跳转或取消的方式守卫导航
+ 全局的前置导航守卫：`router.beforeEach((to, from) => {})`
  - 返回值：
    1. `return false`：无法跳转
    2. undefined 或者不写返回值：正常返回
    3. 字符串：路径，跳转到对应的路径
    4. 对象：类似于router.push({ path: url, ... })
  - to：即将跳转到的路由对象
#### 路由独有守卫
#### 组件内的守卫
> 组件不切换，内容改变

## Vuex
> Vuex **状态管理**
+ 之前的状态管理 ---- 使用组件化的开发方式
  - 在组件中定义 data 或者在 setup 中返回使用的数据，这些数据被称之为 state
  - 在模板 template 中我们可以使用这些数据，模板最终会被渲染成 DOM，我们称之为 view
  - 在模板中会产生一些行为事件，处理这些行为事件时，有可能会修改 state，这些行为事件称之为 actions
+ 复杂的状态管理
  + js 需要管理的状态越来越多，复杂度 ↑
  + 这些状态包括服务器返回的数据、缓存数据、用户操作产生的数据等
  + 也包括一些 UI 的状态，比如元素是否被选中，是否显示加载动效，当前分页
+ 将组件内部的状态抽离出去，以一个**全局单例**的方式来管理
  - 在这种模式下，我们的组件树构成了一个巨大的“视图view”
  - 不管在树的哪个位置，任何组件都能获取状态或触发行为
  - 通过**定义和隔离状态管理中的各个概念**，并通过**强制性的规则**来维护视图和状态间的**独立性**，我们的代码会变得更加结构化和易于维护、跟踪
  - 借鉴 Redux、Flux

![vuex 图片](\imgs\23_vuex.jpg)






## Vue devtool
> vue 官方提供的工具，方便对于组件或者 vuex 的调试

1. `npm install vuex@next`
2. 导出仓库
   ```js
   import { createStore } from 'vuex'

    const store = createStore()

    export default store
   ```
3. 使用
   ```js
   import store from './store'

   app.use(store)
   ```
