<!--
 * @Author: East
 * @Date: 2022-01-01 15:16:46
 * @LastEditTime: 2022-01-01 17:14:17
 * @LastEditors: Please set LastEditors
 * @Description: this 绑定规则细节 + 面试题分析
 * @FilePath: \forGreaterGood\javascript\05-this绑定规则细节+面试题分析.md
-->

# this 绑定规则细节 + 面试题分析

## 一、内置函数的 this 分析

1. setTimeout(fn, duration)
   - 普通函数 --> 独立函数调用
   - 箭头函数 -->
2. 监听点击事件
   1. DOM1
      ```js
      const boxDiv = document.querySelector(".box");
      boxDiv.onlick = function () {
        console.log(this); // boxDiv
      };
      ```
      - 浏览器内部调用方式：`boxDiv.onclick()`
   2. DOM2
      ```js
      boxDiv.addEventListener("click", function () {
        console.log(this);
      });
      boxDiv.addEventListener("click", function () {
        console.log(this);
      });
      boxDiv.addEventListener("click", function () {
        console.log(this);
      });
      ```
      - 内部方式应该是将函数放到一个数组中，然后 call 调用
3. 数组 API：forEach, map, filter, find
   - forEach
     ```js
     var names = ["abc", "bac", "cab"];
     names.forEach(function (item) {
       console.log(this);
     });
     ```
     - 可通过 `names.forEach(fn, thisArg)` 另外绑定

## 二、绑定规则优先级

1. 隐式调用与显式调用比较，显式绑定优先级更高

   ```js
   function foo() {
     console.log(this);
   }

   var obj = {
     name: "obj",
     foo: foo.bind("aaa"),
   };
   obj.foo();
   ```

## 三、this 规则之外

1. 显式绑定对 null 和 undefined 的设置

   ```js
   function foo() {
     console.log(this);
   }

   foo.apply(null); // window 对象
   foo.apply(undefined); // window 对象
   ```

   - bind 和 call 同样

2. 间接函数引用

   ```js
   var obj1 = {
     name: 'obj1',
     foo: function() {
       console.log(this)
     }
   }

   var obj2 = {
     name: 'obj2'
   }
   obj2.bar = obj1.foo
   obj2.bar()； // obj2 对象

   (obj2.bar = obj1.foo)() // window 对象：独立函数调用
   ```

3. 箭头函数 --> 跟随上层的 this

   ```js
   var obj = {
     data: [],
     getData: function () {
       /** 发送网络请求，将结果放到上面的 data 属性中 */
       // 1. 在箭头函数之前的方案
       var _this = this;
       setTimeout(function () {
         _this.data = [1, 2, 3];
       }, 2000);

       // 2. 使用箭头函数
       setTimeout(() => {
         this.data = [1, 2, 3];
       }, 2000);
     },
   };
   ```
