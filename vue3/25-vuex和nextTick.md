<!--
 * @Author: East
 * @Date: 2021-11-16 15:29:31
 * @LastEditTime: 2021-11-17 19:33:51
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-vuex和nextTick.md
-->
# Vuex 和 nextTick

## Vuex
### actions
+ action 类似于 mutation，不同在于
  - action 提交的是 mutation，而不能直接更改状态
  - action 可以包含任意异步操作
+ 参数：context
  - context 是一个和 store 实例均有相同方法和属性的 context 对象
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

+ mutation 返回值可以是 Promise 对象

### module
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

## nextTick
