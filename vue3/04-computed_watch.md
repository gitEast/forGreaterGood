<!--
 * @Author: your name
 * @Date: 2021-11-05 09:02:36
 * @LastEditTime: 2021-11-05 16:10:48
 * @LastEditors: Please set LastEditors
 * @Description: 计算属性、watch
 * @FilePath: \vue3\04-computed_watch.md
-->
# computed and watch
## computed
### why computed?
> 在模板中可以通过插值语法显示一些 data 中的数据，而有些数据需要进行一定的复杂转化
+ 在模板中使用表达式
  - 好处 ---- 方便实现
  - 弊端
    1. 插值语法的设计初衷是用于**简单的运算**
    2. 在模板中放入太多的逻辑会让模板过重和难以维护
    3. 如果在多个地方用到相同的逻辑，则代码大量重复
+ 解决办法
  1. 使用 methods
     - 解决了代码重复的问题
     - 但没有缓存，如果是相同的结果，每次都需要重新计算
  2. 使用 computed ---- 解决所有问题

### What is computed?
+ 官方：
  - 对于任何包含响应式数据的复杂逻辑，你都应该使用计算属性
  - 计算属性将会被混入到组件实例中。**所有 getter 和 setter 中的 this 上下文自动地绑定为组件实例**
+ 用法：以下两种方法都可
    ```ts
    { 
      [key: string]: Function,
      [key: string]: {
        get: Function,
        set: Function
      }
    }
    ```

### computed 实际使用
```js
export default {
  data() {
    return {
      firstName: 'east',
      lastName: 'wind'
    }
  },
  computed: {
    // 定义了一个计算属性叫 fullName
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}
```
```html
<template>
  <div>{{ fullName }}</div>
  <div>{{ fullName }}</div>
  <div>{{ fullName }}</div>
</template>
```

#### computed VS methods
> computed 在该特定情境下的优点
1. 直观、优雅
2. 有缓存，多次使用时运算只执行一次 ---- 缓存与响应式原理有关

#### computed 的 setter 和 getter
```js
export default {
  computed: {
    // fullName 的 getter 方法的语法糖
    fullName: function() { ... },
    // 完整写法
    fullName: {
      get: function() { ... },
      set: function(newValue) { ... }
    }
  }
}
```

## watch -- 侦听器
### 认识 watch
+ 作用：侦听数据变化
    ```js
    export default {
      data() {
        return {
          question: 'hello',
          answer: ''
        }
      },
      watch: {
        // question 侦听 data 中的值的变化
        question(newValue, oldValue) {}
      }
    }
    ```
+ 用法：`watch: { [key: string]: string | Function | Object | Array }`
  - 其他变态写法
    ```js
    watch: {
      info: [
        handler1(newValue, oldValue) {},
        'hanlder2',
        {
          handler: function() {}
        }
      ]
    }
    
    /** 或者 this.$watch API */
    created() {
      this.$watch("info", {
        handler(newValue, oldValue) {}
      }, {
        immediate: true,
        deep: true
      })
    }
    ```
+ 配置选项
  - 默认情况下，侦听器只会监听的数据本身的改变
    ```js
    export default {
      data() {
        return {
          info: {
            name: 'east',
            age: 18
          }
        }
      },
      watch: {
        info(newValue, oldValue) {
          console.log(newValue, oldValue)
        }
      }
    }
    ```
  - 其他配置：深度侦听、立即执行
    ```js
    watch: {
      info: {
        handler(newValue, oldValue) {},
        deep: true, // 深度侦听
        immediate: true, // 立即执行(此时 oldValue 是 undefined)
      }
    }
    ```

## 补充
1. 当使用深度侦听时，如果侦听的是引用类型的数据，那么新值与旧值是一样的
   1. 使用引用赋值，而不是深拷贝
