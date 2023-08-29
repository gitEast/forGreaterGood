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
