# TypeScript

- 两个阶段
  1. 语法
  2. 实战

## 一、邂逅

> 任何新技术的出现都是为了解决原有技术的痛点。

- JS 的缺点：类型缺失
  - => 代码不安全、不健壮
  - => 不适合开发大型项目，安全隐患大(人脑不可信任)
  - => ts: 可以在开发阶段进行检测
- 定义
  - Github: TypeScript is a superset of JavaScript that compiles to clean JavaScript output.
  - TypeScript 官网: TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.
- 特点
  1. 始于 JavaScript，终于 JavaScript。
  2. 强大的工具，用于构建大型项目。
  3. 拥有先进的 JavaScript: 始终跟进 JavaScript 的新特性
- 运行环境
  1. webpack: babel
  2. tsc: ts-node

## 二、语法

### 2.1 类型声明

类型注解：Type Annotation.

### 2.2 类型推导

- 类型推导：Type Infer
  - `let` => 通用类型
  - `const` => 字面量类型

### 2.3 数据类型

> JavaScript 与 TypeScript 类型比较

| JavaScript | TypeScript                                   |
| ---------- | -------------------------------------------- |
| Number     | number                                       |
| String     | string                                       |
| Boolean    | boolean                                      |
| undefined  | undefined                                    |
| null       | null                                         |
| Array      | string[] / Array<string>                     |
| Object     | object(一般不用，而是使用 interface or type) |
| Symbol     | symbol                                       |
|            | tuple                                        |
|            | any                                          |
|            | unknown                                      |
|            | never                                        |
|            | void                                         |
|            | 字面量类型                                   |

- any
  - 使用情况
    1. 操作过于繁琐
    2. 引入的第三方库缺少类型注解
- unknown: 更安全的 any 类型
  - 用于描述不确定的变量
  1. 直接进行任何操作都不合法(赋值除外)
  2. 可以在类型缩小(类型校验)后进行相应操作
- never:
  - 一般开发中用不到，封装工具 or 第三方库开发时会用到
  - 示例
    ```ts
    function handleMessage(msg: string | number) {
      switch (typeof msg) {
        case 'string':
          // 进行对应操作
          break;
        case 'number':
          // 进行对应操作
          break;
        default:
          const check: never = msg;
          break;
      }
    }
    ```
- void: 函数返回为空的返回值类型

### 2.4 函数类型

#### 2.4.1 参数与返回值类型

- 参数类型
  - 一般函数: 必须明确指定参数的类型
  - 匿名函数: 大多数情况会根据上下文类型自动推导，一般不需要明确指定
- 返回值类型: 可以通过推导，也可以明确指定

#### 2.4.2 函数类型表达式

```ts
type IFoo = (num: number): number
```

- only 函数特性

#### 2.4.3 函数调用签名 Call Signatures

```ts
interface IBar {
  name: string;
  age: number;
  (num: number): number;
}
```

- 函数特性 + 对象特性

### 2.5 type 与 interface

- type
  - 作用: 起别名
- interface
  - 使用范围：仅限于对象类型
  - 更适配对象类型

### 2.6 联合类型与交叉类型

> 利用多种运算符，从现有类型中构建新类型。

- 联合类型 Union's Type
- 交叉类型 Intersection Type

### 2.7 类型断言与非空类型断言

- 类型断言
  - 用于更具体的类型 or 不太具体的类型
- 非空类型断言
  - 存在安全隐患

### 2.8 类型缩小 Type Narrowing

1. `typeof`: 使用最多
2. `===`: 一般用于字面量类型
3. `[obj] instanceof [class]`
4. `in`: 对象是否拥有某个属性
