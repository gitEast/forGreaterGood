<!--
 * @Author: East
 * @Date: 2021-11-11 10:39:16
 * @LastEditTime: 2022-02-23 16:51:22
 * @LastEditors: Please set LastEditors
 * @Description: 动态 + 异步 + keep-alive + 生命周期
 * @FilePath: \forGreaterGood\vue3\13-动态-异步-keepalive-生命周期.md
-->

# 动态 + 异步 + keepalive + 生命周期

## 动态组件

> 想要实现一个功能，点击一个 tab-bar，切换不同的组件显示

- 方法一：v-if ---- 代码过于臃肿，不够优雅
- 方法二：动态组件

  ```vue
  <!-- App.vue -->
  <template>
    <div>
      <component is="home"></component>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        tabs: ["Home", "About", "Category"],
      };
    },
  };
  </script>
  ```

  - 使用 component 组件，有一个特殊的 attribute is 来实现

- 方法三：路由

## 异步组件

### webpack 的代码打包

- 默认的打包过程
  - 默认情况下，在构建整个组件树的过程中，因为组件和组件之间是通过模块化直接依赖的，那么 webpack 在打包时就会将组件模块打包到一起(比如一个 app.js 文件中)
    - app.[hash].js -- 自己的逻辑
    - chunk-venders.[hash].js -- 第三方依赖
  - 这样，随着项目的不断庞大，app.js 文件的内容过大，会造成首屏的渲染速度变慢
- 分包
  - 对于一些不需要立即使用的组件，可以对它们进行拆分，拆分成一些小的代码块 chunk.js
  - 这些 chunk.js 会在需要时从服务器下载下来，并且运行代码，显示相应内容
  - 通过 import 函数导入的模块，后续 webpack 对其进行打包的时候就会进行分包的操作

### Vue3 中的异步组件

```js
import { defineAsyncComponent } from "vue";

import Loading from "./pages/loading.vue";

// 工厂函数
const AsyncCategory = defineAsyncComponent(() =>
  import("./pages/AsyncCategory.vue")
);
// 对象：可以传入更多的属性
const AsyncCategory = defineAsyncComponent({
  loader: () => import("./pages/AsyncCategory.vue"),
  loadingComponent: Loading, // 没加载完成之前的占位组件
  errorComponent: errorCom, // 加载失败的组件
  delay: 2000, // 显示 loadingComponent 之前的等待时间
  onError: function (err, retry, attemps) {
    // 监听失败
    // err: 错误信息
    // retry：函数，调用 retry 尝试重新加载
    //attempts：记录尝试的次数
  },
});

export default {
  components: {
    AsyncCategory,
  },
};
```

- defineAsyncComponent 函数
  - 接收类型
    - 工厂函数
    - 对象
- 一般在路由中使用异步组件
- Suspense：一般和异步组件一起使用
  - 实验性特性
  - 内置的全局组件，有两个插槽
    - default：如果 default 可以显示，就显示
    - fallback：如果 default 不能显示，则显示
      ```vue
      <template>
        <div>
          <suspense>
            <tempalte #default>
              <async-category></async-category>
            </tempalte>
            <tempalte #fallback>
              <loading />
            </tempalte>
          </suspense>
        </div>
      </template>
      ```

## keep-alive

> 组件切换默认会销毁之前的组件，并创建当前需要的新组件。如果考虑到性能的优化和状态的保存，可以使用 keep-alive

```vue
<template>
  <keep-alive>
    <component></component>
  </keep-alive>
</template>
```

- 属性 -- String, RegExp, Array -- 根据组件的 name 属性
  - include：名称匹配的组件会被缓存
  - exclude： 不会被缓存
  - max：最多可以缓存的实例个数，一旦达到这个数字，那么缓存组件中最近没有被访问的组件会被销毁

## 获取 DOM 元素

- $refs
- $root
- $parent

## 生命周期

- 什么是生命周期
  - 每个组件都可能会经历从创建、挂载、更新、卸载等一系列的过程
  - 在这个过程中的某一个阶段，可能会想要添加一些属于自己的代码逻辑(比如组件创建完后就请求一些服务器数据)
  - 但如何可以知道目前组件正在哪一个过程呢？ -- Vue 提供了组件的生命周期函数
- 生命周期函数
  - 是一些钩子函数，在某个时间会被 Vue 源码内部进行调用
  - 通过对生命周期函数的回调，可以知道目前组件正在经历什么阶段
  - 也能够在该生命周期中编写逻辑代码了

### 生命周期流程

- beforeCreate：初始化事件和生命周期
- created：创建组件实例并初始化，把数据放入响应式系统
- beforeMount：编译模板
- mounted：创建 app.$el 并添加至 el
- beforeUpdate：当数据发生改变
- updated：虚拟 DOM 重新渲染和更新
- beforeUnmount：调用了 app.unmount()
- unmounted：已卸载
- beforeDestroy
- destroyed
- activated：活跃的(先 created)
- deactivated：失活的

## 组件的 v-model

- 案例

  ```vue
  <!-- App.vue -->
  <template>
    <div>
      <hy-input v-model="message"></hy-input>
      <hy-input :modelValue="message" @update:model-value="message = $event"></hy-input>
    </div>
  </tempalte>

  <script>
    import HyInput from './HyInput.vue'

    export default {
      components: {
        HyInput
      },
      data() {
        return {
          message: 'hello'
        }
      }
    }
  </script>

  <!-- HyInput.vue -->
  <template>
    <div>
      <button @click="btnClick"></button>
      <input :value="modelValue" @change="change" />
      <input v-model="value" />
    </div>
  </tempalte>

  <script>
    import HyInput from './HyInput.vue'

    export default {
      props: {
        modelValue: String
      },
      emits: ["update:modelValue"],
      computed: {
        value: {
          set(value) {
            this.$emit("update:modelValue", value)
          },
          get() {
            return this.modelValue
          }
        }
      },
      methods: {
        btnClick(event) {
          this.$emit("update:modelValue", 'click')
        },
        change(event) {
          this.$emit("update:modelValue", event.target.value)
        }
      }
    }
  </script>
  ```

- 绑定多个值

  ```vue
  <!-- App.vue -->
  <template>
  <div>
    <hy-input v-model="message" v-model:title="title"></hy-input>hy-input>
  </div>
  </tempalte>

  <script>
  import HyInput from './HyInput.vue'

  export default {
    components: {
      HyInput
    },
    data() {
      return {
        message: 'hello',
        title: 'title'
      }
    }
  }
  </script>

  <!-- HyInput.vue -->
  <template>
  <div>
    <button @click="btnClick"></button>
    <input :value="modelValue" @change="change" />
    <input v-model="value" />
  </div>
  </tempalte>

  <script>
  import HyInput from './HyInput.vue'

  export default {
    props: {
      modelValue: String,
      title: String
    },
    emits: ["update:modelValue", "update:title"],
    computed: {
      value: {
        set(value) {
          this.$emit("update:modelValue", value)
        },
        get() {
          return this.modelValue
        }
      },
      title: {
        set() {},
        get() {}
      }
    },
    methods: {
      btnClick(event) {
        this.$emit("update:modelValue", 'click')
      },
      change(event) {
        this.$emit("update:modelValue", event.target.value)
      }
    }
  }
  </script>
  ```
