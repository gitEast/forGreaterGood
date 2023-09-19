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

- 类型推导：Type infer
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

### 2.4 函数类型

1. 参数类型: 必须明确指定参数的类型
2. 返回值类型: 可以通过推导，也可以明确指定

### 2.5

### 2.6
