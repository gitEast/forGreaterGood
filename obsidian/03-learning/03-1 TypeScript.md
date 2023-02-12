# TypeScript
#TypeScript  #coderwhy 

## 1. TypeScript 的成因和目标
1. 为什么会出现 TypeScript 并流行？
	- main：**类型缺失**
	- 流行的原因：
		- main：类型
		- 随着 JavaScript 的更新而更新
		- 源于 JavaScript，归于 JavaScript。—— 不是取代，而是补充。![[03-1-TypeScript-ts与js的关系.png]]
			- 学完 js 后上手 ts 的成本低
2. TypeScript 的目标？

## 2. TypeScript 的优势和劣势
- 优势
	1. 代码的健壮性
		- 类型 --> 大型项目的可行性
			- 不要信任自己，也不要信任别人 —— 信任强制的契约
	2. 使用别人的成果 —— 如何使用、传参等
- 劣势
	1. 据说类型体操很难

## 3. TypeScript 适用的场景
1. 大型项目
2. 第三方框架、工具
3. 自行封装的工具

## 4. TypeScript 组成部分和关键部分
### 4.1 数据类型
- `undefined`
- `string`
- `number`
- `boolean`
- `Array`
- `Object`
	- 其实一般不用最根本的 `Object` 类型
	- 另外写 type or interface
- `any`
- `unknown`
- `void`
- `never`
	- 非常特殊的一个值，修改别人的代码时很好用
- `void`
- `tuple`
	- 例，`[ 123, 'aaa', {b: 'bbb'} ]`

### 4.2 类型的使用
- 定义类型
	- 联合类型
	- 交叉类型


## 5. 技术的底层原理和关键实现
### 5.1 归于 JavaScript
TypeScript 解析 --> JavaScript --> 运行在浏览器 or Node 环境里

- 实现方案
	- [webpack 搭建](https://mp.weixin.qq.com/s/wnL1l-ERjTDykWM76l4Ajw)
	- ts-node 库

## 6. 已有的实现和它之间的对比
flow 语言