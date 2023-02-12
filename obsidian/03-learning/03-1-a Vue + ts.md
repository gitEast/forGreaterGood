1. 创建项目：`npm init vue@latest` ![[03-1-a-vue+ts-createProject.png]]
2. 安装依赖：`npm install`
3. 类型声明 vue 文件 .env.d.ts
	```ts
	// 声明 vue 文件
	declare module "*.vue" {
	  import { DefineComponent } from "vue";
	  const component: DefineComponent;
	  export default component;
	}
	```
4. .editorconfig
	```
	# http://editorconfig.org
	
	root = true
	
	[*] # 所有文件都适用
	charset = utf-8 # 设置文件字符集为 utf-8
	indent_style = space # 缩进风格 tab | space
	indent_size = 2 # 缩进大小
	end_of_line = lf # 控制换行类型 lf | cr | crlf
	trim_trailing_whitespace = true # 去除行首的任意空白字符
	insert_final_newline = true # 始终在文件末行插入一个新行
	
	[*.md] # 仅 md 文件适用以下规则
	max_line_length = off
	trim_trailing_whitespace = false
	```
5. .prettier.json 和 .eslintrc.cjs 配置