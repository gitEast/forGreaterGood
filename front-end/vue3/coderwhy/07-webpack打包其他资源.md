<!--
 * @Author: east
 * @Date: 2021-11-07 15:40:32
 * @LastEditTime: 2021-11-07 19:54:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\07-webpack打包其他资源.md
-->

# webpack 打包其他资源

## 打包图片

### file-loader

- background-img 属性

- img 标签

1. `npm install file-loader -D`
2. 配置

   ```js
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "./build",
        },
      },
    },
   ```

3. 导出的图片名称是哈希值，无法分辨，且都在打包的文件夹下
4. 对图片进行命名 ---- 有多个 placeholder
   1. [ext]：处理文件的扩展名
   2. [name]：处理文件的名称
   3. [hash]：生成的 128 位 hash 值(32 个字符)
   4. [contentHash]：在 file-loader 中与 [hash] 一直，在 webpack 的一些其他地方不一致
   5. [hash:<length>]：截图 hash 的长度，默认太长了
   6. [path]：文件相对于 webpack 配置文件的位置

### url-loader

- 工作方式与 file-loader 相似，但可以将较小的文件转成 base64 的 URI

1. 安装 `npm install url-loader -D`

## asset module type

> 在 webpack5 之前，加载资源需要使用一些 loader，但从 webpack 开始，可以直接使用**资源模块类型(asset module type)**，来替代这些 loader

- 四种新的模块类型
  - asset/resource：发送一个单独的文件并导出 url，之前通过 file-loader 实现
  - asset/inline：导出一个资源的 data URI ---- url-loader
  - asset/source：导出资源的源代码 ---- raw-loader
  - asset：在导出一个 data URI 和发送一个单独的文件之间自动选择 ---- 通过 url-loader，并配置资源体积限制实现

```js
{
  test: /\.(jpe?g|png|gif|svg)$/i,
  type: "asset",
  generator: {
    filename: "img/[name]_[hash:6][ext]",
  },
  parser: {
    dataUrlCondition: {
      maxSize: 100 * 1024,
    },
  },
},
```

### 字体

## 插件

> webpack 的另一个核心是 Plugin，官方有这样一段描述：While loaders are used to transform certain types of modules, plugins can be leveraged to perform a widr range of tasks like bundle optimization, asset management and injection of environment variables.

- loader 是用于特定的模块类型进行转换
- Plugin 可以用于执行更广泛的任务，比如打包优化、资源管理、环境变量注入等

### CleanWebpackPlugin

- 用途：更改配置时，`npm run build` 时自动删除原先的打包文件夹

1. `npm install clean-webpack-plugin -D`
2. 导入插件
3. 配置
   ```js
   // plugins: [一个个对象];
   plugins: [new CleanWebpackPlugin()];
   ```

### HtmlWebpackPlugin

- 一个不太规范的地方

### DefinePlugin

- webpack 内置插件
- 用于 BASE_URL 的设置

### CopyWebpackPlugin

- 复制 public 文件夹下的文件
- `npm install copy-webpack-plugin -D`

### 配置 mode

```js
module.exports = {
  mode: "development", // 开发模式
  devtool: "source-map", // 建立映射文件，方便调试代码和错误
};
```
