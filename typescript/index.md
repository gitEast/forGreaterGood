# TypeScript

- 两个阶段
  1. 语法
  2. 实战
- TS 学习等级
  1. 知道 ts，但从未用过
  2. AnyScript
  3. 大多数时候使用 `any`，但普通的类型用法也可以把握
  4. 大多数时候类型使用正确，极少数情况下使用 `any`
     - 业务代码没有问题
  5. 使用 TS 封装高级类型，包括框架中某些特殊类型(例如 pinia, vuex, ...)
     - 玩类型体操
  6. TS 源码开发者

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
|            | 枚举类型                                     |

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
- 枚举类型
  ```ts
  enum Direction {
    LEFT,
    RIGHT,
    UP,
    DOWN
  }
  const d1: Direction = Direction.LEFT;
  ```
  - 位运算
    ```ts
    enum Operation {
      READ = 1 << 0, // 1 => 1
      WRITE = 1 << 1, // 10 => 2
      PICK = 1 << 3 // 100 => 4
    }
    ```
    - 便于后续运算

### 2.4 函数类型

#### 2.4.1 参数与返回值类型

- 参数类型

  - 分类标准一
    - 一般函数: 必须明确指定参数的类型
    - 匿名函数: 大多数情况会根据上下文类型自动推导，一般不需要明确指定
  - 分类标准二
    - 可选参数: 指定类型 + `undefined` 的联合类型
    - 参数默认值
      1. 类型注解可以忽略
      2. 可以接收 `undefined`
    - 剩余参数
  - 函数作为参数

    ```ts
    type CallbackType = (num1: number, num2: number) => number;

    function foo(fn: CallbackType) {
      fn(1, 2);
    }
    function add(num1: number, num2: number) {
      return num1 + num2;
    }

    foo(add);
    ```

    - 检测原理
      ```ts
      type res = typeof add extends CallbackType ? true : false;
      ```

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

#### 2.4.4 构造签名 Constructor Signatures

```ts
class Person {}

interface ICTROPerson {
  new (): Person;
}

function factory(fn: ICTORPerson) {
  const f = new fn();
  return f;
}

factory(Person);
```

#### 2.4.5 函数重载

> by 重载签名 overload signatures

```ts
function add(num1: number, num2: number)
function add(str1: string, str2: string)

funciton add(arg1: any, arg2: any) {
  return arg1 + arg2
}
```

- 尽量使用联合类型而非重载签名

#### 2.4.6 this

- this 可推导
  - default: `any`
  - if 对 ts 进行配置
    1. `tsc --init`
    2. `"noImplicitThis": true` 配置为没有隐式的 this(默认 false)
    3. 会根据上下文推导
       - if 无法推导，则报错
       - `this` 可以作为函数的第一个参数(编译过程中会除去 s)
- this 相关内置工具

  - `ThisParameterType`: 获取 this 的类型
  - `OmitThisParameter`: 除 this 外的参数
  - `ThisType`: 设置 `this` 的类型

    ```ts
    function foo() {}
    type FooType = typeof foo;
    type This_Type = ThisParameterType<FooType>;
    type PureFooType = OmitThisParameter<FooType>;

    /** 设置 this 的类型 */
    interface IState {
      name: string;
    }
    interface IStore {
      state: IState;
      getName: () => string;
    }

    const store: IStore & ThisType<IState> = {
      state: { name: 'east' },
      getName() {
        return this.name;
      }
    };
    ```

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

### 2.9 类

#### 2.9.1 基本使用

1. 属性需要先声明再使用
2. 成员修饰符
   - `public`
   - `private`
   - `protected`
3. 属性修饰符
   - `readonly`
4. `getter/setter`
   - 一般针对私有属性使用(`_[key]`)
   - 进行拦截，防止不合理的操作 or 数据
