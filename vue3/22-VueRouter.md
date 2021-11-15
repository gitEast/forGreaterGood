<!--
 * @Author: East
 * @Date: 2021-11-15 10:40:01
 * @LastEditTime: 2021-11-15 14:43:35
 * @LastEditors: Please set LastEditors
 * @Description: VueRouter 深入解析
 * @FilePath: \forGreaterGood\vue3\22-VueRouter.md
-->
# VueRouter
+ vue-router 基于路由和组件
  - 路由用于设定访问路径，将路径和组件映射起来
  - 在 vue-router 的单页面应用中，页面的路径的改变就是组件的切换

## vue-router 使用
1. `npm install vue-router@4`
   - 如果是脚手架的话，自动安装
2. 路由的使用步骤
   1. 创建路由组件的组件
      ```vue
      <!-- Home.vue -->
      <template>
        <div>
          <h2>About</h2>
        </div>
      </template>
      <script>
      export default {
        
      }
      </script>
      <style scoped>
        
      </style>

      <!-- About.vue -->
      <template>
        <div>
          <h2>About</h2>
        </div>
      </template>
      <script>
      export default {
        
      }
      </script>
      <style scoped>
        
      </style>
      ```
   2. 配置路由映射：组件和路径映射关系的 routes 数组
      ```js
      import Home from '../pages/Home.vue'
      import About from '../pages/About.vue'

      // 映射关系配置
      const routes = [
        {
          path: '/home',
          component: Home
        },
        {
          path: '/about',
          component: About
        }
      ]
      ```
   3. 通过 createRouter 创建路由对象，并且传入 routes 和 history 模式
      ```js
      import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

      // 创建路由对象 router
      const router = createRouter({
        routes,
        history: createWebHashHistory()
      })
      ```
      + 路由模式 history
        - history 模式：`createWebHistory()`
        - hash 模式：`createWebHashHistory()`
   4. 安装路由对象
      ```js
      /** router/index.js */
      export default router

      /** main.js */
      import router from './router'

      const app = createApp(App)
      app.use(router)
      ```
   5. 使用路由：by `<router-link>` 和 `<router-view>`
      ```vue
      <template>
        <div>
          <h2>哈哈哈哈</h2>
          <h2>呵呵呵呵</h2>
          <div>
            <router-link to='/home'>home</router-link>
          </div>
          <router-link to='/about'>about</router-link>
          <router-view></router-view>
        </div>
      </template>

      <script>
      export default {
        name: 'App'
      }
      </script>

      <style>
      </style>
      ```
+ 重定向
   ```js
   // 映射关系配置
  const routes = [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    }
  ]
   ```
+ history 模式
   ```js
   import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

    // 创建路由对象 router
    const router = createRouter({
      routes,
      history: createWebHistory()
    })
   ```
+ `<router-link>` 属性
  - to
  - replace：无法返回原本的页面，被略过了
  - `class="router-link-active router-link-exact-active"`：设置样式
    - active-class="xxx"：可以将被选中的 class 改名为 xxx
    - exact-active-class
+ 路由懒加载
  ```js
  // 映射关系配置
  const routes = [
    {
      path: '/home',
      component: () => import('../pages/Home.vue')
    },
    {
      path: '/about',
      component: () => import('../pages/About.vue')
    }
  ]
  ```
  + 添加打包名字
    ```js
    // 映射关系配置
    const routes = [
      {
        path: '/home',
        component: () => import(/* webpackChunkName: 'home-chunk' */'../pages/Home.vue')
      },
      {
        path: '/about',
        component: () => import(/* webpackChunkName: 'about-chunk' */'../pages/About.vue')
      }
    ]
    ```
+ 路由的属性
  - path
  - component
  - redirect
  - name：给路由对象取名，可以根据名字进行路由跳转
  - meta：自定义数据，添加额外信息

### 动态路由基本匹配
+ 方法一：
  ```js
  {
    path: '/user/:username',
    component: () => import('../pages/User.vue')
  }
  ```
  ```vue
  <!-- App.vue -->
  <template>
    <router-link to='/user/why'>user</router-link>
  </template>

  <!-- User.vue -->
  <template>
    <h2>{{$route.params.username}}</h2>
  </template>

  <script>
    export default {
      created() {
        const name = this.$route.params.username
      }
    }
  </script>
  ```
  + setup 中拿取
    ```js
    import { useRoute } from 'vue-router'

    export default{
      setup() {
        const route = useRoute()
        const name = route.params.username
      }
    }
    ```

### Page Not Found
```js
{
  path: '/:pathMatch(.*)',
  component: () => import('../pages/NotFound.vue')
}
```
```vue
<!-- 拿到路径 -->
<template>
  <h2>{{$route.params.pathMatch}}</h2>
</template>
```

### 路由嵌套
+ 路由注册
  ```js
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '',
        redirect: '/home/msg'
      },
      {
        path: 'msg',
        component: () => import('../pages/home/Msg.vue')
      },
      {
        path: 'shops',
        component: () => import('../pages/home/Shops.vue')
      }
    ]
  },
  ```
+ 母级使用
  ```vue
  <template>
    <div>
      <h2>Home</h2>
      <div>
        <router-link to="/home/msg">消息</router-link>
      </div>
      <div>
        <router-link to="/home/shops">商品</router-link>
      </div>
      <router-view></router-view>
    </div>
  </template>
  ```

### 编程式导航
> 代码跳转
```vue
<template>
  <div>
    <button @click="jumpTo('/home')">首页</button>
    <button @click="jumpTo('/about')">关于</button>
    <router-view></router-view>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'App',
  // methods: {
  //   jumpTo(url) {
  //     this.$router.push(url)
  //   }
  // },
  setup() {
    const router = useRouter()
    const jumpTo = (url) => {
      // router.push(url)
      router.push({
        path: url,
        query: {
          name: 'why',
          age: 18
        }
      })
    }

    return {
      jumpTo
    }
  }
}
</script>
```
