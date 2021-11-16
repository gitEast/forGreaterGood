<!--
 * @Author: your name
 * @Date: 2021-11-16 09:57:45
 * @LastEditTime: 2021-11-16 15:40:44
 * @LastEditors: Please set LastEditors
 * @Description: Vuex 核心 ---- state, getter, mutation
 * @FilePath: \forGreaterGood\vue3\24-vuex核心.md
-->
# Vuex
## 单一状态树
+ Vuex 使用**单一状态树**
  - 用一个对象就包含了全部的应用层级的状态
  - 采用的是 **SSOT**，Single Source of Truth，也可以翻译成**单一数据源**
  - 这也意味着，每个应用将仅仅包含一个 store 实例
  - 单状态树和模块化并不冲突 -- by module
+ 单一状态树的优势
  - 如果状态信息保存到多个 store 对象中，那么之后的管理和维护等等都会变得特别困难
  - 所以 Vuex 也使用了单一状态树来管理应用层级的全部状态
  - 单一状态树能够用最直接的方式找到某个状态的片段，而且在之后的维护和调试过程中，也可以非常方便地管理和维护

## 组件获取状态
+ 使用 computed：表达式太长，计算属性好用
+ mapState：映射 state
  ```js
  import { mapState } from 'vuex'
  export default {
    computed: {
      fullName() {},
      ...mapState(['name', 'counter', 'age']),
      ...mapState({
        sCounter: state => state.counter
      })
    }
  }
  ```
+ setup 使用
  ```js
  import { useStore, mapState } from 'vuex'
  import { computed } from 'vue'

  export default {
    setup() {
      const store = useStore()
      const sCounter = computed(() => sotre.state.counter)

      const storeState = mapState(['name', 'counter', 'age'])
      const sStoreState = {}
      Object.keys(storeState).forEacht(fnKey => {
        const fn = storeState[fnKey].bind({ $store: store })
        sStoreState[fnKey] = fn
      })

      return {
        ...sStoreState
      }
    }

  }
  ```
  + 封装
    ```js
    import { useStore, mapState } from "vuex";
    import { computed } from 'vue'

    export function useState(mapper) {
      const store = useStore()

      const storeStateFns = mapState(mapper)

      const storeState = {}
      Object.keys(storeStateFns).forEach(fnKey => {
        const fn = storeStateFns[fnKey].bind({ $store: store })
        storeState[fnKey] = computed(fn)
      })

      return storeState
    }
    ```

### getters
见 24-code/01_learn_vuex

### mutations
```js
const store = createStore({
  mutations: {
    incrementN(state, payload) => {
      state.counter += payload.number
    }
  }
})

// 使用 
this.$store.commit('incrementN', {number: 10})
```
