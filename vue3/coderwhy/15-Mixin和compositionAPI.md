<!--
 * @Author: East
 * @Date: 2021-11-12 11:27:37
 * @LastEditTime: 2021-11-12 16:06:10
 * @LastEditors: Please set LastEditors
 * @Description: vue3 的 Mixin 和 composition API 的一部分
 * @FilePath: \forGreaterGood\vue3\15-Mixin和compositionAPI.md
-->
# Mixin 和 extends 和 composition API
## Mixin
> 组件和组件之间有时候会存在相同的代码逻辑，这些相同的代码逻辑会被抽取
+ Mixin 介绍
  - 提供了一种非常灵活的方式，来分发 Vue组件中的可复用功能
  - 一个 Mixin 对象可以包含任何组件选项
  - 当组件使用 Mixin 对象时，所有 Mixin 对象的选项将被混合进入该组件本身的选项中
+ Mixin 本身的是一个对象
  - 一般会创建一个 mixins 文件夹
  - 只要是组件内可以编写的内容(js)，都可以编写到 mixin 对象中
  - 是一个数组：可能会混入多个 mixin
+ 合并规则
  - 如果没有重名现象，没有问题
  - 如果重名
    1. data -- 以组件为准
    2. 生命周期钩子函数 -- 合并，都调用
    3. 对象的选项(methods, components, watch 等等) -- 以组件为准
+ 全局混入 Mixin
  - app.mixin(globalMixin)

## extends
+ 一种类似于 Mixin 的方式
+ 不常用，更常用的是 extends
---

## Composition API
### Options API
+ Options API 的特点：在**对应的属性**中编写**对应的功能模块**
+ 弊端
  1. 实现某个功能时，这个功能对应的代码逻辑会被拆分到各个属性中
  2. 当组件变得更大、更复杂时，逻辑关注点的列表就会增长，同一个功能的逻辑会被拆分得很分散
  3. 这种碎片化的代码使得理解和维护这个复杂的组件变得异常困难，并且隐藏了潜在的逻辑问题
  4. 当处理单个逻辑关注点的时候，需要不断地跳到相应的代码块中
### Composition API 的使用
#### 参数：props, context
+ props：父组件传递过来的属性
+ context
  - attrs：非 props 的 attrs
  - slots：父组件传递过来的 slot -- render 函数使用
  - emit：女 → 母
#### why this 不能用
> setup() 并没有绑定 this

#### Reactive API
> 如果想为 setup 中定义的数据提供响应式的特性，可以使用 reactive 函数进行包裹
1. 因为当使用 reactive 函数处理数据之后，数据再次被使用时就会进行依赖收集
2. 当数据发生改变时，所有收集到的依赖都是进行对应的响应式操作(比如更新界面)
3. 事实上，data 选项也是在内部交给了 reactive 函数将其编成响应式对象的

#### Ref API
> 如果要将基本数据类型的数据加入响应式系统，vue3提供了 ref 的API
+ ref 的使用
  + 在 `<template>` 中使用时，ref 对象会自动解包
  + 在 setup 函数中使用，则需要用 ref.value 格式
+ ref 的解包是一种浅层的解包
  - 当 ref 对象放到一个普通对象中，`<template>` 无法解包
  - 当 ref 对象放到 reactive 可响应式对象中，那么内容的 ref 可以解包

#### readonly API
> 通过 reactive 或 ref 可以获取到一个响应式的对象，但在某些情况里，传入给其他地方(组件)的这个响应式对象希望在另一个地方(组件)被使用，但不能被修改，此时可以通过 readonly API 实现
+ readonly 会返回原生对象的只读代理
  - 即它依然是一个 Proxy，但 set 方法被劫持，不能被修改
+ 对 普通对象、ref 对象、reactive 对象都支持
