# Vue3 实战 (TypeScript 版)

- 大前端时代：**与客户直接交互**
	- 前端
	- 移动端：iOS / android
	- 桌面端：window / Mac
	- 其他平台：穿戴设备 / 车载系统(智能汽车) / VR / AR / ...
	- web3 方向
- 后台管理系统
	- 一般不允许注册
	- 创建用户 -> 分配角色 -> 分配权限

## 1. 创建 Vue 项目
- 两种方式
	- Vue CLI
		- 基于 webpack
		- `vue create my-project`
	- create-vue
		- 基于 vite
		- `npm init vue@latest`

- 目录结构
	- env.d.ts
	- index.html                         入口文件
	- package-lock.json
	- package.json
	- README.md
	- tsconfig.config.json
		- 作用
			1. 尽量在这个文件里配置
			2. 对 vite 的编译选项
	- tsconfig.json
		```json
		{
			"extends": "@vue/tsconfig/tsconfig.web.json",
			"compilerOptions": {
				"baseUrl": ".",
				"paths": {
					"@/*": ["./scr/*"]
				}
			},
			"reference": [
				{
					"path": "./tsconfig.config.json"
				}
			]
		}
		```
		- 由于继承自`@vue/tsconfig/tsconfig.web.json` 文件，所以 `compilerOptions` 配置得少
			- 对于项目而言，脚手架会隐藏大部分配置，而暴露一些
		- 不建议修改这个文件，尽量在 `tsconfig.config.json` 中修改
	- vite.config.ts                     项目编译的配置文件

## 2. Vue 项目的配置

### 2.1 类型声明
```ts
/** env.d.ts */
/// <reference types="vite/client">

// 声明 vue 文件
declare module "*.vue" {
	import { DefineComponent } from 'vue'
	const component: DefineComponent
	export default component
}
```

npm 强制清除缓存 `npm cache clean --force`

### 2.2 代码规范
- editorconfig：为不同编辑器用户维护一致的编码风格
	- 同时需要安装对应插件，否则 vscode 无法应用该文件
- prettier：代码保存时格式化
	1. 安装 `npm install pretttier -D`
	2. 设置 `.prettierrc.json` 文件 (有多种格式)
	3. package.json 中配置 `"prettier": "prettier --write"`
		- `useTabs`：使用 tab 时用 tab 还是空格
		- `printWidth`：一行的长度
		- `singleQuote`：单引号？
		- `trailingComma`：尾部逗号？
		- `semi`：尾部分号？
	4. 安装 prettier 插件，并配置 format on save 和 default format
- eslint：代码编写时检测格式
	- 需要与 prettier 匹配
		1. 安装 `npm install eslint-plugin-prettier`
		2. 在 .eslintrc.cjs 文件中添加 `'extends': [..., 'plugin:prettier/recommended']`
	```js
	module.exports = {
		rules: {
			'@typescript-eslint/no-unused-vars': 'off' // 关闭未使用的提示
		}
	}
	```

### 2.3 CSS
1. `npm install normalize.css`
2. 安装 less：`npm install less`

### 2.4 路由
```ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/:patchMatch('*)',
			component: () => import('../views/not-found/NotFound.vue')
		}
	]
})

export default router
```

### 2.5 pinia
`npm install pinia`

```ts
import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
```

```ts
/** counter.ts */
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
	state: () => ({
		counter: 100
	}),
	getters: {
		doubleCounter(state) {
			return state.counter * 2
		}
	},
	actions: {
		changeCounterAction(newCounter: number) {
			this.counter = newCounter
		}
	}
})
```

### 2.6 Axios

### 2.7 区分 development 和 production 环境
```ts
let BASE_URL = ''
if (import.meta.env.MODE === 'production') {
	BASE_URL = 'http'
} else {
	BASE_URL = ''
}
```

- vite 默认提供的环境变量
	- `import.meta.env.MODE`：`development` / `production`
	- `import.meta.env.DEV`：是否是开发环境
	- `import.meta.env.PROD`：是否是生产环境
	- `import.meta.env.SSR`：是否运行在 server 上
- `.env` 文件与 vite 的联动
	- `.env` 文件
		```
		VITE_NAME=EAST
		```
	- vite 中可以通过 `import.meta.env.VITE_NAME`
	- 区分环境的文件
		- `.env`
		- `.env.development`
		- `env.production`

### 2.8 Element-Plus 集成

## 3. 正式开始项目

### 3.1 登录页面
`.app` 如何占满整个页面?
```css
.app {
	width: 100vw;
	height: 100vh;
}
```
























