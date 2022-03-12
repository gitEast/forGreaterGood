<!--
 * @Author: East
 * @Date: 2021-11-13 14:24:38
 * @LastEditTime: 2021-11-13 17:07:21
 * @LastEditors: Please set LastEditors
 * @Description: Composition API 和 高级语法补充
 * @FilePath: \forGreaterGood\vue3\17-compositionAPI继续.md
-->
# Composition API 和 高级语法的补充

## Composition API
### 生命周期函数钩子
+ onBeforeMount
+ onMounted
+ onBeforeUpdate
+ onUpdated
+ activated
+ deactivated
+ onBeforeUnmount
+ onUnmounted

可以注册多个生命周期

### provide / inject
```js
/** 外婆 */
import { ref, provide, readonly } from 'vue'

export default {
  setup() {
    const name = ref('east')
    let counter = ref(100)

    provide('name', readonly(name))
    provide('counter', readonly(counter))
  }
}

/** 我 */
import { inject } from 'vue'

export default {
  setup() {
    const name = inject('name', 'defaultValue')
  }
}
```
+ 替代 provide/inject 选项
+ 可以设置默认值
+ 核心：单向数据流

## h 函数
> 在特殊场景，需要 JavaScript 的完全编程的能力，这个时候可以使用**渲染函数**，它比模板更接近编译器
+ why 更接近？
  1. Vue 在生成真实的 DOM 之前，会将节点转成 VNode，而 VNode 组合在一起行程一棵树结构，就是虚拟 DOM(VDOM)
  2. 而 template 模板中的 HTML 最终也是使用渲染函数生成对应的 VNode
  3. 如果想充分利用 JavaScript 的编程能力，可以编写 createVNode 函数，生成 VNode
+ 如何使用 JavaScript 编写代码？
  - 使用 h 函数 -- 用于创建 VNode 的一个函数
### h 函数的使用
```js
<script>
  import { h } from 'vue'

  export default {
    render() {
      return h('h2', { class: 'title' }, 'hello')
    },
  }
</script>

<style>
  .title {
    color: red
  }
</style>
```
+ 三个参数
  - tag：String | Object | Function -- 必需
  - props: Object -- 可选
  - children: String | Array | Object -- 可选
+ setup 实现计数器案例
  ```js
  <script>
  import { ref, h } from 'vue'

  export default {
    setup() {
      const counter = ref(0)

      return () => {
        return h('div', null, [
          h('h2', null, `当前计数：${counter.value}`),
          h('button', {
            onClick: () => counter.value++
          }, '+1'),
          h('button', {
            onClick: () => counter.value--
          }, '-1')
        ])
      }
    }
  }
  </script>
  ```

## jsx
### jsx 的 babel 配置
> 如果在项目中使用 jsx，需要添加对 jsx 的 babel 支持

```js
<script>
import { ref } from 'vue'
export default {
  setup() {
    const counter = ref(0)

    const increament = () => counter.value++
    const decreament = () => counter.value--

    return () => {
      return (
        <div>
          <h2>当前计数：{ counter.value }</h2>
          <button onClick={increament}>+1</button>
          <button onClick={decreament}>-1</button>
        </div>
      )
    }
  }
}
</script>

<style>
</style>
```
+ 插槽写法，见 17-code/02_jsx
