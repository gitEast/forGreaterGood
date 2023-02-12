# webpack
#coderwhy  #webpack

## 一. webpack 的依赖图
### 1.1 webpack 如何打包？
1. 根据 命令 or 配置文件 找到入口文件
2. 从入口开始，生成一个 **依赖关系图**，该图包含应用程序中所需的所有模块
3. 遍历图结构，打包一个个模块 (根据文件的不同，使用不同的 loader 来解析)

## 二、webpack 打包
### 2.1 CSS 打包
1. css 模块引入 main.js 中，打包
2. 打包失败 => 原因：
	1. **需要一个 loader 来加载这个 css 文件，but what's a loader?**
		1. **loader 可以用于对模块源代码进行转换**
		2. **将 css 文件看成是一个模块，通过 import 来加载这个模块**
		3. **在加载这个模块时，webpack 其实并不知道如何对其进行加载，必须制定对应的 loader 来完成这个功能**
	2. **webpack 内置 js 处理，所以对 js 模块，不需要另外配置**
	3. **如果有文件你不知道 webpack 如何处理，其作者需要开发对应的 loader**
		1. **`.vue` 文件 => `vue-loader`**
		2. **配置文件：module: rules => 匹配 `.vue` 文件 => 使用 `vue-loader`**
3. postcss：进行 CSS 的转换和适配
	1. `npm install postcss -D`
	2. 2. `npm install autoprefixer -D`
4. 

## tips
1. if 只是模块引入，而非导出使用，可以直接 `import "文件"`
