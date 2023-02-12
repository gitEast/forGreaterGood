# TypeScript 语法扩展

## 1. TypeScript 模块使用
- 模块化
	- 一个 js 文件若没有导出语句，会被认为是一个脚本，共享全局作用域；ts 亦如是
	- 需要 `export {}` 
- 如果导入的是 类型，建议加上 `type` 前缀
	- **Together these allow a non-TypeScript transplier like Babel, swc or esbuild to know what imports can be safely removed.**

## 2. TypeScript 命名空间
- 命名空间 namespace
	- ES Module 出现之前的替代品
```ts
export namespace price {
	export function format(price) {
		return `$price`
	}
}

export namespace date {
	export function format() {
		return '2022-10-16'
	}
}

pricae.format(10)
date.format()
```

## 3. 内置声明文件的使用
- `.d.ts` 文件
	- 类型声明(Type Declaration) / 类型定义(Type Definition) 文件

- ts 类型查找
	- 内置类型声明
	- 外部定义类型声明
	- 自己定义类型声明
- 内置类型声明
	- `npm install typescript -g`，包括声明
	- 命名模式 `lib.[].d.ts`
		- `lib.es2015.d.ts`

## 4. 第三方库声明的文件
- 通常是两种类型声明方式
	- 库内部自己进行类型声明，如 axios
	- 社区公有库 DefinitelyTyped 存放类型声明文件
		- [Github 地址](https://github.com/DefinitelyTyped/DefinitelyTyped/)
		- [查找某个库声明的安装方式](https://www.typescriptlang.org/dt/search?search=)
	- (特例) 以上两种都没有，需要自己编写类型声明文件

## 5. 编写自定义声明文件
```ts
/** type.d.ts */
// 全局变量声明
declare const myName: string
declare const myAge: number
declare const myFriend: string

declare function foo(bar: string): string

declare class Person {
	constructor(public name: string, public age: number)
}

// 声明文件模块
declare module "*.png"

// vue
declare module "*.vue" {
	import { DefineComponent } from 'vue'
	const component: DefineComponent
	
	export default component
}

// jQury: 声明成模块不合适，命名空间可以
declare namespace $ {
	export function ajax(settings: any): any
}
```

## 6. tsconfig 配置文件解析
- tsconfig.json 文件的作用
	1. (main) 规定 TypeScript Compiler 编译的方式
	2. 对编辑器提示
	- 类似于 jsconfig.json 文件

[官网查询](https://typescriptlang.org/tsconfig)

- tsconfig.json 顶层选项
	- compilerOptions 
		- `"target": "esnext"`：目标代码
		- `"module": "esnext"`：生成代码使用的模块化
		- `"strict": true`：打开所有的严格模式检查
		- `"allowJs": false`：是否允许编写 js 代码
		- `"noImplicitAny": false`：是否可以有模糊的 any
		- `"jsx": "preserve`：保留 jsx 代码 --> 留待 Babel
		- `"importHelpers": true`：
		- `"moduleResolution": "node"`：引入模块的查找规则
		- `"skipLibCheck": true`：跳过对整个库的类型检测，而仅仅检测使用到的类型
		- `"esModuleInterop": true`：允许 ES Module 和 Commonjs 互相调用
		- `"allowSyntheticDefaultImports": true`：允许合成默认模块导出
		- `"sourceMap": true`
		- `"baseUrl": "."`：
		- `"paths": { "@/*": ["src/*] }`：路径映射设置
		- `"lib": ["esnext", "dom", "dom.iterable", "scripthost"]`：指定需要使用到的库 (默认会推导)
	- files
		- 数组格式
		- 作用：指定项目中包括哪些文件
		- 通常用于项目中文件较少时
	- include
		- 数组格式
		- 作用：指定在项目中包括哪些文件
		- 默认匹配根目录下所有文件
	- exclude
		- 数组格式
	- 其他配置选项 (项目中见到再解析)


## TS: Axios 封装


## 类型体操
### 1. 条件类型 Conditional Types
用于描述 **输入类型** 和 **输出类型** 之间的关系
`SomeType extends OtherType? TrueType: FalseType`

```ts
/** 举个例子：函数的重载 */
function sum<T extends number | string>(arg1: T, arg2: T): T extends number? number: string
function (arg1, arg2) {
	return arg1 + arg2
}


/** 获取一个函数的返回值类型 */
type CalcFnType = (num1: number, num2: number): number

function foo() {
	return 'abc'
}

type CalcReturnType = ReturnType<CalcFnType>
type FooReturnType = ReturnType<typeof foo>

// 返回值类型
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R? R: never
// 参数类型
type MyParameterType<T extends (...args: any[]) => any> = T extends (...args: infer A) => any? A: never
```

分发条件类型 Distributive Conditional Types

- Pick
- Omit
- Exclude：排除
- Extract：提取
- NonNull
- InstanceType









