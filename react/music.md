# 网易云项目实战

React + ts

## 一、项目搭建

1. 项目创建
   - `create-react-app react_ts_music` 弊端
     1. 项目基于 webpack
     - webpack 所有配置都是隐藏的
     - `eject` 可以暴露 webpack 配置，但不可逆
     2. TypeScript React 项目的配置有难度
     - TypeScript Compiler: tsc 类型检测
     - Babel: 最终转换
   - => `create-react-app react_ts_music --template typescript`
2. 删除 `src/` 下文件，剩余
   - `App.tsx`
   - `index.tsx`
   - `react-app-env.d.ts`
     - 类型声明文件
3. 项目配置

   - icon
   - 标题
   - 项目别名等 (craco.config.ts)

     1. `npm install @craco/craco@alpha -D`
     2. `craco.config.js`

        ```js
        const path = require('path');
        const resolve = (dir) => path.resolve(__dirname, dir);

        module.exports = {
          webpack: {
            alias: {
              '@': resolve('src')
            }
          }
        };
        ```

        ```json
        {
          "compilerOptions": {
            "baseUrl": ".",
            "paths": {
              "@/*": ["src/*"]
            }
          }
        }
        ```

     3. 更改 `package.json` 中的脚本

   - tsconfig.json

4. 代码规范
   - `.editorconfig`
   - `.prettierrc`
     1. `npm install prettier -D`
        - 作用： `"prettier": "prettier --write ."`
        - 增加 `.prettierignore` 文件
   - eslint
     1. `npm install eslint -D`
     2. git bash: `npx eslint --init`
5. 项目目录结构划分: assets, base-ui, components, hooks, router, store, service, utils, views
6. CSS 重置
   - `npm install normalize.css`
   - `src/assets/css/reset.less`, `index.less`, `common.less`
7. 路由

   1. `npm install react-router-dom`
   2. `src/router/index.tsx`

      ```tsx
      import { RouteObject } from 'react-router-dom';
      const routes: RouteObject[] = [
        {
          path: '/',
          element: ''
        }
      ];

      export default routes;
      ```

   3. `App.tsx`

      ```tsx
      import { useRoutes } from 'react-router-dom';

      function App() {
        return <div className="App">{useRoutes(routes)}</div>;
      }
      ```

   4. `index.tsx`

      ```tsx
      import { HashRouter } from 'react-router-dom';

      root.render(
        <HashRouter>
          <App />
        </HashRouter>
      );
      ```

   5. 分包处理

      ```tsx
      /** router/index.tsx */
      import { lazy } from 'react';

      const Discover = lazy(() => import('@/views/discover'));

      /** App.tsx */
      import { Suspense } from 'react';

      function App() {
        return (
          <Suspense fallback="loading">
            <div className="main">{useRoutes(routes)}</div>
          </Suspense>
        );
      }
      ```

      - 懒加载导致不能立刻出现新页面，需要有应急方案

   6. 子页面 c-views

   - 各个页面: discover, focus, mine, download

     ```tsx
     import React, { memo } from 'react';
     import type { FC, ReactNode } from 'react';

     interface IProps {
       children?: ReactNode;
     }

     const ${1: Home}: FC<IProps> = () => {
       return <div>${1: Home}</div>;
     };

     export default memo(${1: Home});
     ```

8. redux 状态管理

   1. `npm install @reduxjs/toolkit react-redux`
   2. `store/index.ts`

      ```ts
      import { configureStore } from '@reduxjs/toolkit';

      const store = configureStore({});

      export default store;
      ```

      ```ts
      /** counter.ts */
      const counterSlice = createSlice({
        name: 'counter',
        initialState,
        reducers: {
          changeMessageAction(state, { payload }: PayloadAction<string>) {
            state.message = payload;
          }
        }
      });
      ```

   3. 使用

      ```tsx
      import { useSelector, TypedUseSelectorHook } from 'react-redux';

      type GetStateFnType = typeof store.getState;
      type IRootState = ReturnType<GetStateFnType>;

      type DispatchType = typeof store.dispatch;

      export const useAppSelector: TypedUseSelectorHook<IRootState> =
        useSelector;

      export const useAppDispatch: () => DispatchType = useDispatch;
      ```

9. 继承 axios
   1. `npm install axios`
   2. 区分开发环境和生产环境
      ```ts
      if (process.env.NODE_ENV === 'development') {
        console.log('开发环境');
      } else {
        console.log('打包环境: production');
      }
      ```
      ```
      .env
      REACT_APP_BASEURL=http://codercab.com:9002
      ```
      - 类型声明文件

## 二、Header 和 Footer 部分

1. 导航栏 `components/app-header/index.tsx`, `app-footer/index.tsx`
   - `AppHeader`
   - `AppFooter`
2. 使用 styled-components
   1. `npm install styled-components -D`
   2. 对 `styled-components` 进行类型声明
      - 类型声明的方法
        1. typescript 内置 DOM
        2. 第三方
           - 库内部已经有类型声明 axios
           - react/rect-dom => @types/react, @types/react-dom
        3. 自己写类型声明
3. 主题

   - 编写
     ```ts
     /** assets/theme/index.ts */
     const theme = {
       color: {
         primary: '#C20C2C'
       },
       mixin: {
         wrapv1: `
           width: 1100px
         `
       }
     };
     ```
   - 使用

     ```tsx
     /** index.tsx */
     import { ThemeProvider } from 'styled-components';

     root.render(
       <Provider store={store}>
         <ThemeProvider theme={theme}>
           <App />
         </ThemeProvider>
       </Provider>
     );
     ```

     ```ts
     /** app-header/style.ts */
     export const HeaderWrapper = styled.div`
       .content {
         ${(props) => props.theme.mixin.wrapv1}
       }
     `;
     ```

4. `HeaderLeft` 和 `HeaderRight`
5. 路由数据 `assets/data/header-titles.json`
   ```json
   [
     {
       "title": "发现音乐",
       "type": "path",
       "path": "/discover"
     },
     {
       "title": "商城",
       "type": "link",
       "link": "https:/"
     }
   ]
   ```
   - 使用 `<NavLink>`，可自动匹配当前匹配的路径 `.active`
