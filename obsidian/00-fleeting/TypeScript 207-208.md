# 邂逅 TypeScript
#TypeScript

## 1. JavaScript 类型缺失
**任何新技术的出现都是为了解决原有技术的某个痛点。**

- JavaScript 的缺点
	- 没有类型检测
		- 代码不够健壮

编程共识：错误出现得越早越好。

## 2. 邂逅 TypeScript 开发

官网：TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

![[Pasted image 20221012191632.png]]

- TypeScript -> JavaScript
	- Babel：一般使用这个
	- TSC

- TypeScript 的特点
	- 是 JavaScript 的超集，又最终转化为 JavaScript
	- 拥有了类型检测，适合开发大型项目
	- 与 JavaScript 更新保持同步

## 3. TypeScript 运行环境
```shell
# 安装
npm install typescript -g

# 查看版本
tsc --version

# 编译 --> 会生成一个新的 js 文件
tsc xxx.ts
```

- 两种方式
	1. webpack：webpack 的 loader --> js --> 浏览器上 [搭建参考](https://mp.weixin.qq.com/s/wnL1l-ERjTDykWM76l4Ajw)
	2. ts-node 库
		```shell
		npm install ts-node tslib @types/node -g
		
		ts-node xxx.ts
		```

## 4. TypeScript 变量声明
- 类型检测
- 类型注解 Type Annotation：`const a: string = 'message'` 此时的 `string` 称为类型注解
- 类型推导
	- 声明变量的同时赋值
		- `const` 会推导出 **字面量类型**
	- 好处：每次都写类型注解太麻烦了，可以省略该步骤

## 5. JavaScript 数据类型
- 小写才是类型
	- 大写是包装类

## 6. TypeScript 数据类型
- `Array`
	```ts
	// 写法一
	let names: string[] = ['abc', 'bbb', 'ccc']
	// 写法二
	let nums: Array<number> = [11, 22, 33]
	```
- `Object` 
	```ts
	type InfoType = {
		name: string,
		age: number
	}
	let info: InfoType = {
		name: 'east',
		age: 23
	}
	```
- `any`： 如果类型 dynamic，即不限制类型，重回 JavaScript
	- 可以对 `any` 类型的值做任何操作
	- 网络请求返回的数据
	- 引入的第三方库缺少类型注解
	- 少用 `any`
- `unknown`
	- 类型不确定的变量
	- 和 `any` 相似，但无法对 `unknown` 类型的值做任何操作 (赋值可以)
		- 如果真的要做，必须进行类型缩小 (类型校验)
- `void`
	- 函数没有返回值时，其返回值为 `void` 
		- 允许 `return undefined` 
	- 用于指定函数类型的返回值为 `void` 
		```ts
		type FooType = () => void
		const foo: FooType = () => {}
		```
	- 如果类型推导 `void`，那么明确有返回值也可以
- `never`
	- 永远不会发生
		```ts
		function foo(): never {
			throw new Error('123')
		}
		
		// 推导出返回值类型为 never[]
		function parseLyric() {
			return []
		}
		```
	1. 开发框架中：扩展工具时，对于一些没有处理的 case，可以直接报错
		```ts
		function handleMessage(message: string | number) {
			switch (typeof message) {
				case "string":
					console.log(message.length)
					break
				case "number": 
					console.log(message)
					break
				default: 
					const check: never = message
					break
			}
		}
		
		handleMessage('aaa')
		handleMessage(123)
		
		// 对参数类型添加 boolean 类型时，仍会报错，需要添加对 case 的处理
		handleMeassage(true) 
		```
	2. 封装一些类型工具时
- `tuple` 元组类型
	- 出现的原因：数组中最好存放相同类型的值
	```ts
	const info: [string, number, number] = ['east', 23, 1.56]
	
	// React
	const [count, setCount] = useState(10)
	```
- 对函数参数和返回值规定类型
	```ts
	function sum(num1: number, num2: number): number {
		return num1 + num2
	}
	
	// 匿名函数最好不要添加类型注解，会根据上下文自动推导 —— 上下文类型 contextual typing
	const names = ['aaa', 'bbb', 'ccc']
	names.forEach(function(item, index) {})
	
	// 参数类型结合对象类型 —— 定义为 Object 没有意义
	function printCoordinate(point: {x: number, y: number}) {
		console.log('x坐标:', point.x);
		console.log('y坐标:', point.y);
	}
	printCoordinate({x: 20, y: 20})
	```
	- 第三方库会为了使用者便于理解，标明返回值类型

## 1. 联合类型和交叉类型
- 联合类型
	- 联合成员 union's member * n --> 联合类型 union type
	- 满足 n 个中的 1 个即可

## 2. type 和 interface 使用

## 3. 类型断言和非空断言

## 4. 字面量类型和类型缩小

## 5. 函数的类型和函数签名

## 6. 函数的重载和 this 类型