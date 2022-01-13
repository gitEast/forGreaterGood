<!--
 * @Author: your name
 * @Date: 2021-11-10 20:04:19
 * @LastEditTime: 2021-11-10 22:47:34
 * @LastEditors: Please set LastEditors
 * @Description: JSON + 数据存储
 * @FilePath: \coderwhy\JSON和数据存储.md
-->

# JSON + 数据存储

## JSON

### 介绍 JSON

- JSON 是一种非常重要的<u>数据格式</u>，不是编程语言
  - 是可以在服务器和客户端之间传输的数据格式
- 全称：JavaScript Object Notation， js 对象符号
  - 由 Douglas Crockford 构想和设计的一种轻量级资料交换格式，算是 JavaScript 的一个子集
  - 虽然被提出的时候是主要应用于 JavaScript 中，但是目前已经独立于编程语言，可以在各个编程语言中使用
  - 很多编程语言都实现了将 JSON 转成对应模型的方式
- JSON 使用场景
  - 网络数据的传输
  - 项目配置文件
  - 非关系型数据库(NoSQL)将 JSON 作为存储格式
- 其他数据格式
  - XML：也是一种标记语言，在解析、传输等各方面都弱于 JSON 目前已经很少被使用了
  - Protobuf：在网络传输中目前越来越多使用的传输格式，但是直到 2021 年的 3.x 版本才支持 JavaScript，所以目前在前端使用较少

### JSON 基本语法

- 支持三种类型的值
  - 简单值：数字(Number)、字符串(String，不支持单引号)、布尔类型(Boolean)、null
  - 对象值：key 必须是字符串且有双引号，value 可以是任意类型的值
  - 数组值：可以放任意值
- JSON 不支持注释

### JSON 序列化

- 将 JavaScript 中复杂的数据类型转化成 JSON

  - 案例：

    ```js
    const obj = {
      name: "why",
      age: 18,
      friends: [{ name: "git", age: 17 }],
    };

    localStorage.setItem("obj", obj); // obj 会被保存为 '[Object Object]'
    localStorage.setItem("obj", JSON.stringify(obj));
    const info = JSON.parse(localStorage.getItem("obj"));
    ```

  1. 直接转化
  2. stringify 第二个参数

     1. replacer `JSON.stringify(obj, ["name", "friends"])`，返回过滤数据
     2. 传入回调函数

        ```js
        JSON.stringify(obj, (key, value) => {
          if (key === "age") {
            return value + 1;
          }
          return value;
        });
        ```

  3. 第三个参数 space
     - 数字：缩进的空格数
     - 字符串：也用于缩进
  4. 如果对象中有 toJSON 方法，那么会被固定成这个方法的返回值

- parse 细节
- 深拷贝 -- by 序列化

  ```js
  const obj = {
    name: "why",
    age: 18,
    friends: [{ name: "git", age: 17 }],
  };

  /** 将 obj 对象的内容放到 info 对象中 */
  // 1. 引用赋值
  const info = obj;

  // 2. 浅拷贝
  const info2 = { ...obj };

  // 3. 深拷贝
  const jsonObj = JSON.stringify(obj);
  const info2 = JSON.parse(jsonObj);
  ```

  - 但是 undefined、函数 和 Symbol 会被忽略

## 浏览器存储方案

### storage

- WebStorage 主要提供了一种机制，可以让浏览器提供一种比 cookie 更直观的 key、value 存储方式
  - localStorage：本地存储
    - 提供一种永久性的存储方法
    - 在关闭网页重新打开时，存储的内容依然保留
  - sessionStorage
    - 会话存储，提供的是本次会话的存储
    - 在关闭会话时，存储的内容会被清除
    - 在同一个标签页跳转，会被认为是同一个会话
- 实际演练
  ```js
  localStorage.setItem(key, value);
  sessionStorage.setItem(key, value);
  ```
- 常用属性和方法
  - setItem(key, value)
  - length
  - key(index)：返回 key
  - getItem(key)
  - removeItem(key)
  - clear()

#### Storage 工具类的封装

```js
class MyCache {
  constructor(isLocal = true) {
    this.storage = isLocal ? localStorage : sessionStorage;
  }

  saveItem(key, value) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key) {
    const value = this.storage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return value;
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  getLength() {
    return this.storage.length;
  }
}

const localCache = new MyCache();
const sessionCache = new MyCache();

export { localCache, sessionCache };
```

### IndexedDB

> 有时候可能会存储一些简单的数据到本地(浏览器中)，比如 token、用户名、密码、用户密码等，比较少存储大量的数据。而如果确实有大量的数据需要存储，这个时候可以选择使用 IndexedDB

- IndexedDB 是一种底层的 API，用于在客户端存储大量的结构化数据
  - 是一种事务型数据库，是一种基于 JavaScript 面向对象数据库，有点类似于 NoSQL(非关系型数据库)
    - 事务：对数据库进行操作的一个操作单元
  - IndexedDB 本身就是基于事务的，我们只需要指定数据库模式，打开与数据库的链接，然后检索和更新一系列事务即可
- 案例

  ```js
  // 打开数据(和数据库建立连接)
  const deRequest = indexedDB.open("why"); // 有的话打开，没有的话创建

  dbRequest.onerr = function (err) {
    console.log("打开数据库失败");
  };

  let db = null;
  dbRequest.onsuccess = function (event) {
    console.log("打开数据库成功");
    db = event.target.result;
  };

  dbRequest.onupgradeneeded = function (event) {
    const db = event.target.result;

    // 创建一些存储对象
    db.createObjectStore("users", { keyPath: "id" });
    db.createObjectStore("students");
  };

  const transaction = db.transaction("users", "readwrite");
  const store = transaction.objectStore("users");

  // 新增数据
  const request = store.add({ id: 101, name: "east", age: 18 });
  request.onsuccess = function () {
    // 成功的回调
  };
  transaction.oncomplete = function () {
    // 全部添加操作完成
  };

  // 查询
  const request = store.get(101); // 单条且知道主键
  request.onsuccess = function (event) {
    console.log(event.target.result); // 拿到查询的数据
  };
  // or 查询所有数据
  const request = store.openCursor();
  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      console.log(cursor.key, cursor.value);
      cursor.continue();
    } else {
      console.log("查询完成");
    }
  };

  // 修改
  const request = store.openCursor();
  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor.key === 101) {
      const value = cursor.value;
      value.name = "james";
      cursor.update(value);
    }
  };

  // 删除
  const request = store.openCursor();
  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor.key === 101) {
      const value = cursor.value;
      value.name = "james";
      cursor.update(value);
    }
  };
  ```

  - 数据库中有一个叫 why 的库
  - 存储对象，逐渐为 keyPath
