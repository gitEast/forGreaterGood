<!--
 * @Author: your name
 * @Date: 2021-11-12 16:18:43
 * @LastEditTime: 2021-11-12 16:54:05
 * @LastEditors: Please set LastEditors
 * @Description: Composition API
 * @FilePath: \forGreaterGood\vue3\16-compositionAPI.md
-->
# Composition API
## Reactive 判断的 API
+ isProxy：检查对象是否是由 reactive 或 readonly 创建的 proxy
+ isReactive
  + 检查对象是否是由 reactive 创建的响应式代理
  + 如果该代理是readonly建的，但包裹了由reactive 创建的另一个代理，也会返回 true
+ isReadonly
+ toRaw
  - 返回 reactive 或 readonly 代理的原始对象
  - 不建议保留对原始对象的持久引用，请谨慎使用
+ shallowReactive
  - 创建一个响应式代理，跟踪其自身的 property 的响应性
  - 不执行嵌套对象的深层响应式转换(即，深层还是原生对象)
+ shallowReadonly
  - 自身的 property 为只读，不执行嵌套对象的深度只读转换

## ref 的 API
### toRefs 和 toRef
```html
<template>
  <div>
    <h2>{{name}} ---- {{age}}</h2>
    <h2>{{ refAge }}</h2>
    <button @click="changeAge"></button>
  </div>
</template>

<script>
  import { reactive, toRefs } from 'vue'
  export default {
    setup() {
      const info = reactive({ name: 'why', age: 18})
      let { name, age } = toRefs(info)
      let refAge = toRef(info, 'age')

      const changeAge = () => {
        // age++
        info.age++
      }

      return {
        name,
        age,
        changeAge,
        refAge
      }
    }
  }
</script>
```
+ 相当于

### 其他的 API
+ unRef：`val = isRef(val)? val.value: val` 的语法糖
+ isRef
+ shallowRef
+ triggerRef
+ customRef
  + 创建一个自定义的 ref，并对其依赖项的跟踪和更新触发进行显示控制
    - 需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数
    - 并且返回一个带有 get 和 set 的对象
  + 对双向绑定的属性进行 debounce (节流)的操作
