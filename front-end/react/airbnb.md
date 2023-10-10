# 爱彼迎项目实践

## 一、项目介绍与规范

### 1.1 项目介绍

- 爱彼迎团队
  - 开发团队国内 200 多个人
  - 经历过数年版本迭代最终完成的一个产品
- 项目核心学习、掌握的知识点
  1. 核心：对前面所学的知识进行练习、实战
  2. 掌握 React 开发的流程、模式、项目架构，项目中会有很多组件、工具等封装、抽取、复用等思想
  3. 最重要的是学习 React 开发的模式和编程的思想

### 1.2 项目规范

1. 命名规范
   1. 文件夹、文件名称统一小写、多个单词以连接符(-)连接
   2. JavaScript 变量名称采用小驼峰标识，常量全部使用大写字母，组件采用大驼峰
2. CSS: 采用普通 CSS 和 styled-component 结合来编写
3. 整个项目不再使用 class 组件，统一使用函数式组件，并且全面拥抱 Hooks
4. 所有函数式组件，为了避免不必要的渲染，全面使用 memo 进行包裹
5. 组件内部状态，使用 `useState`, `useReducer`；业务数据全部放在 redux 中管理
6. 函数组件内部基本按照如下顺序编写代码
   1. 组件内部的 state 管理
   2. redux 的 hooks 代码
   3. 其他 hooks 相关代码(比如自定义 hooks)
   4. 其他逻辑代码
   5. 返回 JSX 代码
7. redux 代码规范如下
   - redux 目前学习了两种模式，在项目实战中尽量都用到，都掌握
   - 每个模块有自己独立的 reducer or slice，之后合并在一起
   - redux 中会存在共享的状态、从服务器获取到的数据状态
8. 网络请求采用 axios
   - 对 axios 进行二次封装
   - 所有的模块请求会放到一个请求文件中单独管理
9. 项目使用 AntDesign、MUI(Material UI)
   - 项目中某些 AntDesign、MUI 中的组件会被拿来使用
   - 但多部份组件还是自己编写、封装、实现
10. 其他规范在项目中根据时机情况决定和编写

### 1.3 准备步骤

1. 创建项目：`npx create-react-app airbnb`
2. 项目配置：

   - icon
   - 标题
   - jsconfig.json: 智能提示
     ```json
     {
       "compilerOptions": {
         "target": "es5",
         "module": "esnext",
         "baseUrl": "./",
         "moduleResolution": "node",
         "paths": {
           "@/*": ["src/*"]
         },
         "jsx": "preserve",
         "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
       }
     }
     ```
   - 配置别名和 less 文件 by craco

     1. 安装: `npm install @craco/craco -D`
     2. craco.config.js

        ```js
        const path = require('path');
        const resolve = (pathname) => path.resolve(__dirname, pathname);

        module.exports = {
          webpack: {
            alias: {
              '@': resolve('src'),
              components: resolve('src/components')
            }
          }
        };
        ```

     3. 修改 package.json 脚本
        ```json
        {
          "scripts": {
            "start": "craco start",
            "build": "craco build",
            "test": "craco test"
          }
        }
        ```
     4. 安装 craco-less

        1. `npm i craco-less@2.1.0-alpha.0`
        2. craco.config.js

           ```js
           const CracoLessPlugin = require('craco-less');

           module.exports = {
             plugins: [{ plugin: CracoLessPlugin }]
           };
           ```

3. 创建文件夹
   - assets
   - base-ui
   - components
   - hooks
   - router
   - store
   - views
   - utils
   - services
4. CSS 样式重置
   - `npm install normalize.css`
   - assets/css/reset.css
5. 路由配置
   1. 安装 `react-router-dom`
   2. 路由映射
      - home
      - entire
      - detail
   3. 异步加载需要 `Suspense` 组件
   - 注意：HashRouter 组件需要在 index.js 中，不能出现在 App.jsx 中
6. Redux 状态管理
   1. `npm install @reduxjs/toolkit react-redux`
   2. 不同模块采取不同方式
      - home -- RTK 模式
      - entire -- 传统模式 index, reducer, constants, createActions
7. axios

   ```js
   /* service/request/index.js */
   class Request {
     constructor(baseURL, timeout) {
       this.instance = axios.create({ baseURL, timeout });
     }
   }

   /* config.js */
   export const BASE_URL = 'http://codercba.com:1888/airbnb/api';
   export const TIMEOUT = 2000;

   // 测试: /home/highscore
   ```

## 二、header 与 footer 搭建

1. 创建 header 组件文件
   - 文件位置
     - components
       - app-header
         - index.jsx
         - c-cpns
           - header-left
           - header-center
           - header-right
       - app-footer
2. 创建样式 `style.js`
   1. `npm install styled-components@latest`
3. svg 使用：`assets/svg`
   - icon_logo.jsx
   - styleStrToObj 方法
4. 主题色 `assets/theme`

   - lightTheme
   - darkTheme
   - 可参考 Ant Design 主题色配置

   1. 设置 theme
      ```js
      const theme = {
        color: {
          primary: '',
          secondary: ''
        },
        text: {},
        mixin: {
          boxShadow: ``
        }
      };
      ```
   2. ThemeProvider from `styled-components` 提供

5. 右侧部分搭建
   1. icon 与样式绘制
   2. panel 面板
      - click -> show/display-none
      - 监听 window 点击事件 -- 注意捕获冒泡顺序
6. 中间部分搭建

## 三、Home

1. home-banner

   1. 图片引入问题

      ```js
      background: url(${require('@/assets/img/cover_01.jpeg')})

      // or
      import coverImg from '@/assets/img/cover_01.jpeg'
      background: url(${coverImg})
      ```

      - webpack 特性：打包后，原有路径找不到图片

2. 中间 content 部分
   1. 高分好评房源 goodPriceInfo
      - 组件
        - `section-header`
          - title
          - subtitle
        - `room-item`
          - 注意图片尺寸问题：宽高比不一致
        - `section-rooms`
        - 集成 UI 组件库：MUI + AntDesign
   2. 网络请求
      - `/home/goodprice`
      - `/home/highscore`
      1. 因为没有顺序要求，await 等待就不合理了
      2. 改为使用 then，通过 dispatch 直接派发
   3. 抽取为 home-section-v1
   4. 带 tabs
      - `/home/discount`
      1. room-item 的个数展示
         - 三个
         - 四个
      2. 封装 section-tabs
      3. 使用 classnames 库
      4. 封装成 home-section-v2
      5. 通过判断是否为空对象渲染组件，避免 useState 首次赋值问题
   5. `/home/hotrecommendest`
   6. 封装 section-footer
      - 区分显示全部文字和颜色
        - 颜色：wapper 中传入
   7. section-tabs 的滚动效果 -- `base-ui/scroll-view`
      1. 使用 section-tabs 作为案例初始设计 scroll-view 组件
      2. 左右两边各有一个按钮，需要控制其是否显示
         1. 先做右边，再做左边
      3. 组件渲染完毕，判断是否显示按钮 scrollWidth, clientWidth, offsetLeft
      4. 完成逻辑功能
         - 左移：offsetLeft
      5. 完成左右按钮的样式
   8. 完成剩余接口数据展示
3. 点击查看更多，跳转至 entire 页面

## 四、Entire

1. entire 页面布局
   - filter -> entire-filter
   - rooms -> entire-rooms
   - pagination -> entire-pagination
2. 绘制 entire-filter 部分
3. 房间列表、当前页码、总数据个数，存储至 store 中
4. 网络请求
   - `entire/list`
     - params: offset, size
5. entire-rooms 部分
   - 使用 `react-slick` 绘制轮播图
     - `aria-label` 是盲人阅读器
6. entire-pagination 部分
   - 颜色修改方法
     1. 自定义主题
     2. 样式修改
7. 指示器（难点）
   1. because 又复杂又通用，另起项目做 demo （本项目暂时不采用这种方法，直接在项目中写）
   2. `base-ui/indicator`
      - 直接引入空白页面测试 `views/demo`
   3. 不管三七二十一，选中哪个就先滚到中间去
   4. 开始区分是否需要滚动
      - if distance < 0 时，= 0 => 左边的特殊情况
      - if distance > 最多可以移动的距离，= 最多可以移动的距离 => 右边的特殊情况
   5. 真正放到页面中，做 dot 指示器
8. room-item
   1. 不同情况下对图片的展示(轮播图片、指示器)
   2. itemClickHandle 事件
      - 点击后跳转至 detail 页面

## 五、Detail

1. 从 Entire 传递过来的 item 数据较大，无法通过路由传递 => 存储至 store 中
   - detailInfo
2. 页面布局
   - detail-pictures
   - detail-infos
3. detail-pictures 部分
   1. 代码热更新，刷新时 redux 中数据丢失 => 复制某一条数据至 redux 中，作为测试数据固定使用
   2. 绘制布局
      1. 详情图片布局
      2. 遮盖层
         - 整体无 hover 时全显
         - 有一个被 hover 时其他遮盖
   3. 图片浏览器
      1. `base-ui/picture-browser`
      2. 定位 fixed，盖住所有东西
      3. 当图片浏览器展示出来时，滚动的功能消失
         - useEffect：调用函数与其返回函数
           - `document.body.style.overflow = 'hidden'`
           - `document.body.style.overflow = 'auto'`
      4. 布局
         - top
         - slider: 中间部分不是使用轮播图，而是一张图片的效果
           - 动画效果：react-transition-group -- SwitchTransition
         - preview
           - 显示与隐藏的切换 —— 定位相对于底部
4. room-item 点击，数据跟随变化

## 六、顶部搜索布局

1. 分析：
   - 在不同页面有不同的位置
2. 将顶部搜索的状态数据存储至 store 的 main 中
   - headerConfig
     - isFixed: boolean
3. 固定定位的判断
   - 路径发生改变时，滚动条位置不变
     - 在 App 中监听路由变化
     - 封装成 hook
       - useScrollTop
4. 动画效果先不管，先做出想要的样式
   1. 修改布局
      - content
      - cover
   2. header-center 中绘制不一样的选择
      - search-bar
      - search-detail
        - search-tabs
5. header-center 中两个部分的变化
   - 使用 CSSTransition
     - `unmountOnExit = true`
6. 点击蒙板 or 滚动一定距离 后关闭
   - 滚动一定距离 useScrollPosition
     - 滚动过于频繁，使用节流函数
       - `underscore` 库
       - `throttle` 函数
     - 使用 useRef 保存上一次的 scrollY，超过 30 就关闭
7. 首页的顶部需要透明度
   - headerConfig 增加属性 topAlpha: boolean
   - 注意：
     1. 透明度有不同的样式
     2. `isAlpha` 为 `true` 时，一定处于搜索状态
        - `isAlpha` 与 `isSearch` 协同判断，是否展示搜索组件
