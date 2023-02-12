# ts 面向对象
## 1. TypeScript 类的使用
- 修饰符
	- `public`
		- 在任意地方皆可访问
		- default
	- `private`
		- 类内部可见
	- `protected`
		- 类内部与 其 child 类内部
	- `readonly`

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

- `getter` / `setter`
	- 对 私有属性 的扩展

- 参数属性
```ts
class Person {
	constructor(public name: string, private _age: number, readonly height: number) {
	}
	
	getInfo () {
		console.log(this.name, this._age, this.height)
	}
}
```

- 类的作用
	1. 创建对应的实例对象
	2. 作为对应实例对象的类型
	3. 可以当作一个有构造签名的函数 `Class === new Fn()`

## 2. TypeScript 中抽象类
```ts
// 抽象类不能实例化
abstract class Shape {
	// 抽象方法必须出现在抽象类中
	// 抽象方法只有声明没有实现体，在 child 类自己实现
	abstract getArea()
	// 
	getInfo() {
		return 123;
	}
}

class Circle extends Shape {
	constructor(public radius: number) {
		super()
	}
	
	getArea() {
		return this.radius ** 2 * Math.PI
	}
}
class Rectangle extends Shape {
	constructor(public width: number, public height) {
		super()
	}
	
	getArea() {
		return this.width * this.height
	}
}

function calcArea(shape: Shape) {
	return shape.getArea()
}

calcArea(new Circle(2))
calcArea(new Rectangle(2, 3))
calcArea({ getArea: function() {} }) // 这样也可以，不会报错
```


## 3. TypeScript 对象类型
- ts 的类型检测 —— 鸭子类型
	- 原因：js 是基于原型构建的对象体系

```ts
interface Person {
	name: string
	age?: number
	readonly friend: string
}
```

- 索引签名 index signature
	- `[index: number]: any` or `[index: string]: any`
	```ts
	interface IIndexType {
		[index: string]: string
	}
	const words: IIndexType = ['aaa', 'bbb', 'ccc'] // 报错
	// 原因：根本还是鸭子类型的原因
	// words.forEach(): words['forEach'] => function，不是 string 类型，出错了
	```
	- 数字类型索引的值类型，必须是字符串索引类型的值类型的 child 类型
		- 原因：`number` 索引其实会被转换成 `string` 来操作

## 4. TypeScript 接口补充
- `interface` 允许继承
	```ts
	interface IPerson {
		name: string
		age: number
	}
	interface IMe extends IPerson {
		friend: string
	}
	
	const me: IMe = {
		name: 'east',
		age: 23,
		friend: 'mz'
	}
	```

- `interface` 可以被类实现
	```ts
	interface IPerson {
		name: string
		age: number
		
		study: () => void
	}
	interface IRun {
		running: () => void
	}
	
	class Person implements IPerson, IRun {
		name: string
		age: number
		
		study() {}
		running() {}
	}
	```

- 抽象类和接口
	- 相似点：都可以在其中实现一个方法，让 child 类 or 实现类 来实现对应的方法
	- 区别
		1. 抽象类是事物的抽象，用于捕捉 child 类的通用特性；接口通常是一些行为的描述
		2. 抽象类通常用于一系列关系紧密的类之间；接口只是用来描述一个类应该具有什么行为
			- 抽象类：is a
			- 接口：has a
		3. 类只能单一继承；接口可以被多层实现
		4. 抽象类中可以有实现体；接口中只能有函数的声明

## 5. 特殊：严格字面量检测
- 严格字面量赋值检测
	- 第一次创建的对象字面量标识为 fresh 新鲜的 --> 进行严格的类型检测，需要严格满足
	- 该对象字面量传递给另一个变量 or 参数时，如果对象字面量类型不存在目标属性中的类型，则报错
	- 当类型断言 or 对象字面量类型扩大时，则不报错

## 6. TypeScript 枚举类型
```ts
enum Direction {
	UP = 100,
	DOWN, // 101 会递增
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

const d1: Direction = Direction.UP

/** 神奇的位运算 */
enum Operation {
	Read = 1 << 0, // 1
	Write = 1 << 1, // 2
	Listen = 1 << 2 // 4
}
```


# 泛型编程

泛型：类型的参数化

## 1. 泛型语法的基本使用
```ts
function bar<Type>(arg: Type) {
	return arg
}

// 写法一
const res1 = bar<number>(123)
const res2 = <string>('aaa')
const res3 = bar<{name: string}>({ name: 'east' })

// 写法二
const res4 = bar('aaa') // 会自动推导为字面量类型
let res5 = bar(111) // 推导为 number 类型
```

```ts
/** useState 的实现 */
function useState<Type>(initialState: Type): [Type, (newState: Type) => void] {
	let state = initialState
	function setState(newState: Type) {
		state = newState
	}
	
	return [state, setState]
}
```

## 2. 泛型接口、类的使用
- 泛型接口
	```ts
	interface IPerson<Type = string> {
		name: Type
		age: number
		friend: Type
	}
	
	const p1: IPerson<number> = {
		name: 111,
		age: 23,
		friend: 222
	}
	const p2: IPerson = {
		name: 'east',
		age: 23,
		friend: 'mz'
	}
	```

- 泛型类

## 3. 泛型约束和类型条件
- 泛型约束 Generic Constraint
	```ts
	interface ILength {
		length: number
	}
	
	// 获取传入的内容，这个内容必须有 length 属性
	function getInfo<Type extends ILength>(arg: Type): Type {
		return arg
	}
	const info1 = getInfo('aaa')
	const info2 = getInfo(['aaa', 'bbb', 'ccc'])
	const info3 = getInfo({ length: 100} )
	```

- 对泛型参数使用约束
	```ts
	interface IPerson {
		name: string
		age: number
	}
	
	type IPersonType = keyof IPerson // 'name' | 'age'
	
	function getObjectProperty<O, K extends keyof O>(obj: O, key: K) {
		return obj[key]
	}
	const info = {
		name: 'east',
		age: 23
	}
	const name = getObjectProperty(info, 'name')
	```

## 4. TypeScript 映射类型
```ts
type MapPerson<Type> = {
	-readonly [Property in keyof Type]-?: Type[Property]
}

interface IPerson {
	name: string
	age?: number
	friend: string
	readonly address: string
}

type IPersonNew = MapPerson<IPerson>
```

## 5. TypeScript 条件类型

## 6. 类型工具和类型体操
[类型体操练习](https://github.com/type-challenges/type-challenges)
[参考答案](https://ghaiklor.github.io/type-challenges-solutions/en/)











