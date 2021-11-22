<!--
 * @Author: East
 * @Date: 2021-11-16 15:29:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-vuex和nextTick.md
-->

# Vuex 和 nextTick

## Vuex

### actions

- action 类似于 mutation，不同在于
  - action 提交的是 mutation，而不能直接更改状态
  - action 可以包含任意异步操作
- 参数：context, payload
  - context
    - context 是一个和 store 实例均有相同方法和属性的 context 对象
      - commit, dispatch, state, rootState, getters, rootGetters
    - 存在 context.state 和 context.getters
    - 但在 modules 中有区别

```js
/** store/index.js */
actions: {
  incrementAction(context, payload) {
    // ... 异步操作
    context.commit('increment', payload)
  }
}

/** 使用 */
this.$store.dispatch('incrementAction', payload)
this.$store.dispatch({
  type: 'incrementAction',
  number: 10
})


import { mapActions } from 'vuex'
setup() {
  const actions = mapActions(['increment'])
  return {
    ...actions
  }
}
```

- mutation 返回值可以是 Promise 对象

  ```js
  /** store/index.js */
  actions: {
    getHomeMultidata() {
      return new Promise((resolve, reject) => {
        axios.get().then(res => {
          resolve()
        }).catch(err => {
          reject()
        })
      })
    }
  }

  /** App.vue */
  setup() {
    onMounted(() => {
      const promise = store.dispatch('getHomeMultidata')
      promise.then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    })
  }
  ```

### module

- why need module?
  - 由于使用单一状态树，应用的所有状态会集中到一个比较大的对象，当应用变得非常复杂时，store 对象就有可能变得相当臃肿
  - 为了解决以上问题，Vuex 允许我们将 store 分割成模块(module)
  - 每个模块拥有自己的 state, mutation, actions, getter，甚至是嵌套子模块
- mutations 和 actions 的第一个参数是局部状态对象

#### 命名空间的快乐 `namespaced: true`

- 当模块被注册后，它的所有 getter, action 及 mutation 都会自动根据模块注册的路径调整命名
- getters 中的参数
  - state
  - getters
  - rootState
  - rootGetters
- actions 的 context 中的属性
  - commit
    - 对根做提交：`commit("increment", null, { root: true })`
  - dispatch
  - state
  - rootState
  - getters
  - rootGetters

```js
/** store/modules/home.js */
const homeModule = {
  namespaced: true,
  state() {
    return { homeCounter: 1 }
  },
  getters: {
    doubleHomeCounter(state) {
      return state.homeCounter * 2
    }
  },
  mutations: {
    increment(state) {
      state.homeCounter++
    }
  }
}

export default homeModule

/** store/index.js */
import { createStore } from 'vuex'
import homeModule from './modules/home.js'

const store = createStore({
  state() {
    return {}
  },
  mutations: {},
  actions: {},
  modules: {
    home: homeModule
  }
})

export default store

/** 使用 */
{{ $store.state.home.homeCounter }}
{{ $store.getters.dobuleHomeCounter }} // 没有 homespaced

export default{
  methods: {
    homeIncrement() {
      this.$store.getters['home/doubleHomeCounter']
    }
  }
}
```

#### 辅助函数

> 有命名空间的情况下

- mapState(['home/homeCounter']) --- 测试不能用
- 对象类型

  ```js
  computed: {
    ...mapState({
      userCounter: (state) => state.user.userCounter,
    }),
    ...mapGetters({
      doubleUserCounter: 'user/doubleUserCounter'
    })
  }
  ```

- 常见写法
  ```js
  computed: {
    ...mapState('user', ['userCounter']),
    ...mapGetters('user', ['doubleUserCounter'])
  },
  methods: {
    ...mapMutations('user', ['increment'])
  }
  ```
- 依赖 createNamespacedHelpers 函数

  ```js
  import { createNamespacedHelpers } from "vuex";
  const { mapState, mapGetters, mapMutations } =
    createNamespacedHelpers("user");

  computed: {
    ...mapState(['userCounter']),
    ...mapGetters(['doubleUserCounter'])
  },
  methods: {
    ...mapMutations(['increment'])
  }
  ```

- hooks 的封装可以对 modules 进行优化

## nextTick

- 官方解释：
  - 将回调推迟到下一个 DOM 更新周期之后执行
  - 在更改了一些数据以等待 DOM 更新后立即使用它

### nextTick 原理

#### Vue 本身维护的队列

| 事件              | 队列      |
| ----------------- | --------- |
| watch(, 回调函数) | preQueue  |
| 组件的更新 update | jobQueue  |
| 生命周期回调      | postQueue |

以上都进入微任务队列执行

#### nextTick

nextTick 的回调函数会进入微任务队列的最后
