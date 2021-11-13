<!--
 * @Author: your name
 * @Date: 2021-11-12 16:18:43
 * @LastEditTime: 2021-11-13 14:20:30
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
  + 对双向绑定的属性进行 debounce (防抖)的操作

## computed
```js
// getter 函数
const fullName = computed(() => {
  return firstName.value + ' ' + lastName.value
})

// 包含 getter/setter 的对象
const fullName = computed({
  get() { return firstName.value + ' ' + lastName.value },
  set(newValue){}
})
```

## watch
> 侦听数据变化
+ watchEffect
  ```js
  watchEffect(() => {
    console.log(`name: ${name.value}, age: ${age.value}`)
  })
  ```
  + 用于自动收集响应式数据的依赖
    - 用到的数据都会侦听
    - 传入即被执行一次
  + 默认第一次就侦听
  + 停止侦听
    ```js
    const changeAge = () => {
      age.value++
      if (age.value > 25) {
        stop()
      }
    }

    // 使用 watchEffect
    const stop = watchEffect(() => {
      console.log(`name: ${name.value}, age: ${age.value}`)
    })
    ```
  + 停止副作用：如果在监听中发送网络请求，发生变化，上一次的网络请求被称为副作用
    ```js
    const stop = watchEffect((onInvalidate) => {
      onInvalidate(() => {
        // 在这个函数中清除额外的副作用
        request.cancel()
        console.log('打印一下')
      })
      console.log(`name: ${name.value}, age: ${age.value}`)
    })
    ```
  + setup 中使用 ref，绑定 html 标签
    ```vue
    <template>
      <div>
        <h2 ref="title">哈哈哈哈</h2>
      </div>
    </template>

    <script>
    import { ref, watchEffect } from 'vue'

    export default {
      setup() {
        const title = ref(null)

        watchEffect(() => {
          console.log(title.value)
        }, {
          flush: 'post'
        })

        return {
          title
        }
      }
    }
    </script>
    ```
    + 立即执行，有一个 null 的值，没必要
    + flush 属性的值 -- 设置执行时间
      - 'pre'：默认，在元素挂载或者更新之前执行 --> 所以打印 null
      - 'post'：挂在之后执行
      - ‘sync'：很少使用，不管了

+ watch -- 等同于 watch 选项
  + 需要手动指定侦听的数据源，并在回调函数中执行副作用
  + 默认情况下是惰性的，只有当被侦听的源发生变化时才会执行回调
  + 与 watchEffect 的比较
    - 懒执行副作用
    - 更具体地说明当哪些状态发生变化时，触发侦听器的执行
    - 访问侦听状态变化前后的值
  + 数据源类型
    - ref
    - reactive
  + 侦听传入不同的值
    - getter 函数
      ```js
      watch(() => info.age, (newValue, oldValue) => {
        console.log('newValue:', newValue, ', oldValue:', oldValue)
      })
      ```
    - 可响应式对象：reactive 对象 or ref 对象
      ```js
      /** reactive 对象 */
      const info = reactive({ name: 'why', age: 18 })
      watch(info, (newValue, oldValue) => {
        console.log('newValue:', newValue, ', oldValue:', oldValue)
      })
      // 问题：打印的值一样，因为是 proxy 对象
      watch(() => {
        return {...info}
      }, (newValue, oldValue) => {
        console.log('newValue:', newValue, ', oldValue:', oldValue)
      })

      /** ref 对象 */
      const age = ref(22)
      const changeAge2 = () => {
        age.value++
      }
      watch(age, (newValue, oldValue) => {
        console.log('newValue:', newValue, ', oldValue:', oldValue)
      })
      ```
  + 深度侦听
## ref -- 再来一次

