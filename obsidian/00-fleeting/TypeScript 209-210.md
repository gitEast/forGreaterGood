- ts 学习等级划分 (coderwhy 观点)：
	1. 知道 ts，但是没有用过
	2. AnyScript => 万物皆可 `any`
	3. 大多数使用 `any`，但是普通的很多类型用法也是可以把握的
	4. 大多数类型都是使用正确的，极少数使用 `any` (业务) —— **至少到这一步**
	5. 可以使用 ts 封装一些高级类型，包括框架当中的某些特殊类型 (piana/vuex)
		- 学会使用 ts 提供的各种内置工具 (`ThisType` / `ReturnType` / ...)
		- 刷一些类型体操
	6. 真正融会贯通，看 ts 源码 (ts 开发者)
## 1. 联合类型和交叉类型
- 联合类型
	- 联合成员 union's member * n --> 联合类型 union type
	- 满足 n 个中的 1 个即可
- 交叉类型 Intersection Types
	- 常用于对象类型的交叉
		```ts
		interface East {
			name: string
			age: number
		}
		interface Coder {
			name: string
			coding: () => void
		}
		
		const wind: East & Coder = {
			name: 'wind',
			age: 23,
			coding: function() {
				console.log('coding')
			}
		}
		```

## 2. type 和 interface 使用
- `type`
	- 用于起别名
	```ts
	type MyNumber = number
	type IdType = number | string
	type PointType = { x: number, y: number, z?: number}
	```
- `interface`
	```ts
	interface PointType { 
		x: number, 
		y: number, 
		z?: number
	}
	```

- 区别
	1. `type` 可以命名任何类型，`interface` 只能声明对象类型
	2. 声明对象时，`interface` 可以多次扩展声明
		```ts
		interface PointType = {
			x: number, 
			y: number
		}
		interface PointType = {
			z: number
		}
		```
	3. `interface` 可以实现继承

## 3. 类型断言和非空断言
- 类型断言 `as`  Type Assertions
	- 只允许类型缩小和 `any`，`unknown` 类型
	- 目的：方便使用
- 非空类型断言

## 4. 字面量类型和类型缩小
```ts
// 将多个字面量联合起来 —— 类似于枚举
type Direction = "left" | "right" | "up" | "down"

// 字面量类型
const info = {
	url: 'aaa',
	method: 'post'
} as const
```

- 类型缩小 Type Narrowing
	- 类型保护 type guards：`typeof padding === "number"`

## 5. 函数的类型和函数签名
- 函数类型
	- 函数类型表达式 Function Type Expression
		- `(...[params list]) => returnType`
	- 调用签名 call signature
		- 函数类型表达式只能表示函数，不能表示对象属性
		```ts
		interface IBar {
			name: string
			age: number
			(num1: number): number
		}
		
		const bar: IBar = (num1: number): number => {
			return 123
		}
		bar.name = 'aaa'
		bar.age = 18
		bar(123)
		```
	- 构造签名
		```ts
		class Person {}
		
		interface ICTORPerson {
			new (): Person
		}
		
		function factory(fn: ICTORPerson) {
			const f = new fn()
			return f
		}
		
		factory(Person)
		```
- 函数类型参数问题
	- ts 对传入的函数类型的参数个数不进行检测 [参考文档](https://www.typescriptlang.org/docs/handbook/intro.html)
	- 可选参数 `type = [type] | undefined`
	- 默认参数
		1. 类型注解可以省略
		2. 可以接收 `undefined`，与不传一样
	- 剩余参数

TS 版本在不断更新：在进行合理的类型检测的情况下，让 ts 同时更好用 (好用和类型检测之间找到一个平衡)。

## 6. 函数的重载和 this 类型
- 函数重载 
	```ts
	// 1. 先编写重载签名 overload signature
	function add (arg1: number, arg2: number): number
	function add (arg1: string, arg2: string): string
	
	// 2. 编写通用的函数实现
	function add(arg1: any, arg2: any): any {
		return arg1 + arg2
	}
	
	add(10 + 20)
	add('aaa' + 'bbb')
	```
- `this`
	- 普通情况下，`this` 的类型为 `any`
	- 特殊配置 —— 需要确定 `this` 的类型
		1. 初始化 ts 配置文件 `tsc --init`，生成 tsconfig.json 文件
		2. 在 tsconfig.json 文件中，打开 `"noImplicitThis": true` 配置
		3. 指定 `this` 的类型
			- 如果能根据上下文推导出类型，不报错
			- 不能就会报错
				```ts
				function foo (this: {name: string}, info: {name: string}) {
					console.log(this)
				}
				
				foo.call({name: 'why'}, {name: 'east'})
				```
	- ts 内置的 `this` 工具
		1. `FooThisType`：获取函数的 `this` 类型
		2. `PureFooType`：删除 `this` 类型，返回剩余的函数类型
		3. `ThisType`：绑定上下文的 `this`
		```ts
		function foo(this: {name: string}, info: {name: string}) {
			console.log(this, info)
		}
		
		type FooType = typeof foo
		
		type FooThisType = ThisParameterType<FooType>
		
		type PureFooType = OmitThisParameter<FooType>
		
		/** ThisType 案例 */
		interface IState {
			name: string
			age: number
		}
		interface IStore {
			state: IState
			eating: () => void
			running: () => void
		}
		
		const store: IStore & ThisType<IState> = {
			state: {
				name: 'east',
				age: 23
			},
			eating: function () {
				console.log(this.name)
			},
			running: function () {
				console.log(this.name)
			}
		}
		```

## ts 面向对象
### 1. TypeScript 类的使用
- 修饰符
	- `public`
		- 在任意地方皆可访问
		- default
	- `private`
		- 类内部可见
	- `protected`
		- 类内部与 其 child 类内部

```ts
class Person {
	// 成员属性：声明成员属性
	public name: string
	age!: number
	private friend: string
	protected brother: string
	
	constructor(name: string, age: number, friend: string) {
		this.name = name
		// this.age = age
		this.friend = friend
	}
	
	eating() {
		console.log(this.name + 'is eating!')
	}
	
	getFriend() {
		return this.friend
	}
}

const p = new Person('east', 23, 'mz')
console.log(p.name)
p.name = 'wind'
p.eating()
console.log(p.friend) // 报错，不可访问
p.getFriend()
```

### 2. TypeScript 中抽象类

### 3. TypeScript 对象类型

### 4. TypeScript 接口补充

### 5. 特殊：严格字面量检测

### 6. TypeScript 枚举类型


























