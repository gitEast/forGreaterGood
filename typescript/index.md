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

- 作用
  1. 创建实例对象
  2. 作为对应实例对象的类型
  3. 作为一个有构造签名的函数

#### 2.9.1 基本使用

1. 属性需要先声明再使用
2. 成员修饰符
   - `public`
   - `private`
   - `protected`
   ```ts
   /** 省略写法 */
   class Alligator {
     constructor(
       public name: string,
       private age: number,
       protected address: string
     ) {}
   }
   ```
3. 属性修饰符
   - `readonly`
4. `getter/setter`
   - 一般针对私有属性使用(`_[key]`)
   - 进行拦截，防止不合理的操作 or 数据

#### 2.9.2 抽象类

```ts
abstract class Animal {
  abstract eating(); // 抽象方法，child 类必须实现该方法

  // 可以拥有实现的方法
  running() {
    console.log('This Animal is running.');
  }
}
```

- **抽象类无法被实例化**
- 抽象类与接口的区别
  - 抽象类：事物的抽象，拥有 children 类的通用特性 => is
  - 接口：一些行为的描述 => has

#### 2.9.3 TS 类型检测原则

鸭子类型

- only cares 属性和行为
- 不关心具体类型

### 2.10 对象类型

#### 2.10.1 基本使用

- 修饰符
  - `?`
  - `readonly`

#### 2.10.2 索引签名 Index Signatures

```ts
interface ICollection {
  [aaa: number]: string;
}
```

- 注意：`number` 类型的索引访问，最终都会被转化成 `string` 类型的索引访问

  - => 两个索引的写法如下

    ```ts
    interface IIndex {
      [index: number]: string;
      [key: string]: any; // 不能使用 string 作为返回值类型的原因：数组有 forEach/map/reduce 等方法
    }

    const names: IIndex = ['郑鳄', 'wind', 'east', 'alligator'];
    ```

    - `number` 类型的值类型 一定是 `string` 类型的值类型的 child 集合

#### 2.10.3 严格字面量赋值检测 fresh

1. 第一次创建的字面量，标记为“新鲜的”(fresh)
2. 对于新鲜的字面量，需严格满足类型要求
3. 对于不新鲜的字面量，不严格要求

### 2.11 interface 接口

- 接口继承
  - 优点：
    1. 减少相同代码的重复编写
    2. 使用第三方库时，可以自定义扩展类型
- 接口的类实现
  ```ts
  class Alligator implements IAlligator {}
  ```

### 2.12 泛型

#### 2.12.1 Why do we need 泛型？

- 类型系统
  - 各种语言都有，用于约束
  - ts 的特别灵活
    - 支持类型编程的类型系统
    - => 难度 ↑↑↑
    - 类型体操
      - `type-changes` 题库
      - `type-changes-solutions` 题解
      - 解题思路
        1. 映射类型
        2. 条件类型
           - `extends`
             - `infer`
             - `as`
             - 分发
        3. `keyof`

#### 2.12.2 初步认识泛型

- 常见缩写
  - T: Type
  - K, V: Key, Value
  - E: Element
  - O: Object
  - R: ReturnType
- `useState` 练习
  ```ts
  function useState<T>(arg: T) {
    function setArg(newArg: T) {
      arg = newArg;
    }
    return [arg, setArg];
  }
  ```

#### 2.12.3 泛型约束 Generic Constraints

1. 要求：必须有 `length` 属性，且保有原类型，不允许丢失

   ```ts
   interface ILength {
     length: number;
   }

   function getInfo<T extends ILength>(arg: T): T {
     return arg;
   }

   const names: string[] = ['郑鳄', 'wind', 'east', 'alligator'];
   getInfo(names);
   ```

2. 要求：返回对象对应属性的值，且该属性在对象中存在

   ```ts
   function getObjectProperty<O, K extends keyof O>(obj: O, key: K) {
     return obj[key];
   }

   interface IAlligator {
     name: string;
     age: number;
   }
   const info: IAlligator = {
     name: '郑鳄',
     age: 24
   };

   getObjectProperty(info, 'name');

   // 注解
   keyof IAlligator; // 'name' | 'age'
   ```

#### 2.12.4 映射类型 Mapped Types

```ts
type MapPerson<T> = {
  -readonly [key in keyof T]-?: T[key];
};
```
