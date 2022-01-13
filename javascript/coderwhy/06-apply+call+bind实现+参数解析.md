<!--
 * @Author: East
 * @Date: 2022-01-01 18:05:38
 * @LastEditTime: 2022-01-01 20:42:32
 * @LastEditors: Please set LastEditors
 * @Description: apply-call-bind 实现 + 参数解析
 * @FilePath: \forGreaterGood\javascript\06-apply+call+bind实现+参数解析.md
-->

# apply-call-bind 实现 + 参数解析

## 一、apply-call-bind 实现

> 该实现是练习函数，不会过度考虑一些边界情况。同样，框架的核心并不复杂，但边界情况占了大头。

### 1. call 的实现

1. 如何在函数的属性上添加一个 call 函数？ --> `Function.prototype.myCall = function() { ... }`
2. 获取到原函数并调用 --> `var fn = this`
3. 将 thisArg 绑定为 原函数的 this --> `thisArg.fn = fn; thisArg.fn()`
4. 调完之后删除 thisArg 中的 fn 属性 --> `delete thisArg.fn`
5. 如果传入的 thisArg 不是对象类型 --> `var realThis = Object(thisArg)`
   - 如果是 `null` 或 `undefined` 时，this 应该是 `window`
6. 有额外的参数 --> 剩余参数 `function(thisArg, ...rest) { ... }`
   - `rest` 此时是一个数组
   - es6 之后推荐这种用法
7. 将结果返回

### 2. apply 的实现

类似于 call 的实现

- 只是参数有不同，从一个一个分散的参数变为数组
- 参数不存在时，`argArray = argArray?? []`

### 3. bind 的实现

bind，真的很骚。

1. 获取到真实需要调用的函数
2. 绑定 this + 对 this 的对象化处理
3. 返回一个 proxyFn，在其中调用原函数
4. 将所有参数汇总到 proxyFn 中

## 二、参数解析

### arguments

```js
function foo(num1, num2, num3) {
  console.log(num1, num2, num3)
}

foo(1, 2, 3, 4, 5)

ao: {
  num1: 1,
  num2: 2,
  num3: 3,
  arguments: Arguments[1, 2, 3, 4, 5]
}
```

- arguments 是一个对应于**传递给函数的参数**的**类数组(array-like)对象**
- 常见操作
  1. `arguments.length`: 获取参数长度
  1. `arguments[index]`: 根据索引值获取某个元素
  1. `arguments.callee`: 获取原函数
- array-like 意味着它不是一个数组类型，而是一个对象类型
  - 类似于数组：拥有数组的一些特性，如上三种
  - 不同于数组：没有数组的一些方法，如 forEach、map 等
- `arguments` 转为数组
  1. `forEach` 一个一个放到 `newArr = []` 中
  2. `var newArr = Array.prototype.slice.call(arguments)` 或 `[].slice.call(arguments)`
     ```js
     // 原因在于 slice 的实现
     Array.prototype.mySlice = function (start, end) {
       var arr = this;
       start = start || 0;
       end = end || arr.length;
       var newArr = [];
       for (var i = start; i < end; i++) {
         newArr.push(arr[i]);
       }
       return newArr;
     };
     ```
  3. `var newArr = Array.from(arguments)`: es6 语法
  4. `var newArr = [...arguments]`
- 箭头函数中没有 `arguments`
  - 全局中是否有 `arguments`
    - 浏览器中没有
    - Node 环境中有
      - 因为在 Node 环境中，一个文件会被当作一个模块，这个模块会被包裹进一个函数里，然后执行这个函数
