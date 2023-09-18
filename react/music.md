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
6. 集成 AntDesign
   1. `npm install antd`

## 三、Discover 页面

1. 小菜单 `discover/c-cpns/nav-bar`
2. 按照业务划分文件夹

   - 在页面文件夹下另开 `service` 和 `store` 文件夹
   - `recommend/service/recommend.ts`

     ```ts
     import myRequest from '@/service';

     export function getBanners() {
       return myRequest.get({
         url: '/banner'
       });
     }
     ```

   - `recommend/store/recommend.ts`

     ```ts
     import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

     export const fetchBannerDataAction = createAsyncThunk(
       'banners',
       async () => {
         const res = await getBanners();
         return res.data;
       }
     );
     export const fetchBannerDataAction = createAsyncThunk(
       'banners',
       async (arg, { dispatch, getState }) => {
         const res = await getBanners();
         dispatch(changeBannersAction(res.banners));
       }
     );

     const recommendSlice = createSlice({
       reducers: {
         changeBannersAction(state, { payload }) {
           state.banners = payload;
         }
       },
       extraReducers: (builder) => {
         builder
           .addCase(fetchBannerDataAction.pending, () => {
             console.log('pending');
           })
           .addCase(fetchBannerDataAction.fulfilled, (state, { payload }) => {
             state.banners = payload;
           })
           .addCase(fetchBannerDataAction.rejected, () => {
             console.log('rejected');
           });
       }
     });
     ```

   - `recommend/index.tsx`
     ```tsx
     const Recommend = () => {
       const dispatch = useDispatch();
       useEffect(() => {
         dispatch(fetchBannerDataAction());
       }, []);
     };
     ```

3. 轮播图

   ```tsx
   import type { ElementRef } from 'react';

   const TopBanner: FC<IProps> = () => {
     const bannerRef = useRef<ElementRef<typeof Carousel>>(null);
   };
   ```

4. recommend 的内容部分
   - TopBanner
   - div.content.wrap-v2
     - div.left
       - hot-recommend
         - @/components/area-header-v1
           1. 隐藏最后的竖线
              - by css
                ```css
                &:last-child {
                  .divider {
                    display: none;
                  }
                }
                ```
              - by JavaScript
                ```tsx
                {
                  index < keywords.length && <span className="divider">|</span>;
                }
                ```
           2. IProps
              ```tsx
              interface IProps {
                children?: ReactNode;
                title?: string;
                keywords?: string[];
                moreText?: string;
                moreLink?: string;
              }
              ```
         - @/views/discover/c-views/recommend/c-cpns/hot-recommend/index.tsx
           - @/components/song-menu-item
             - div.top
               - @/utils/format.ts
                 - `formatCount(count: number) {}`
                 - `getImageSize(imageUrl: string, width: number, height: number) {}`
             - div.bottom
       - new-album
     - div.right
5. recommend 的网络请求
   - `/personalized?limit=30`: 热门推荐 getHotRecommend
   - `/album/newest`: 新碟上架 getNewAlbum

## 四、底部播放栏

- 属于播放工具，但不属于 play 页面
  - => `src/news/player/app-player-bar` 组件
- 永远固定在页面底部，不依赖页面切换
  - => 写在 App.tsx 中
- div 布局
  - content
    - BarControl
    - BarPlayerInfo
      - Link
      - info
      - process 进度条
        - Slider from 'antd'
        - time
    - BarOperator
- 播放逻辑

  - 对于要播放哪一首歌曲
    - only 播放权，没有决定权
    - => 从 state.currentSong 中 get
  - 播放器 `<audio>`

    ```tsx
    function AppPlayerBar = () => {
      const audioRef = useRef<HTMLAudioElement>(null)
      const [isPlaying, setIsPlaying] = useState(false)

      /** 组件内的副作用操作 */
      useEffect(() => {
        audioRef.current!.src = currentSong.id
        audioRef.current?.play().then(res => {
          console.log('歌曲播放成功')
        }).catch(err => {
          console.log('歌曲播放失败：', err)
          setIsPlaying(false)
        })
      }, [currentSong])

      return <audio ref={audioRef}></audio>
    }
    ```

  - 进度条
    ```tsx
    function AppPlayerBar = () => {
      const [progress, setProgress] = useState(0)
      // 总时间
      const [duration, setDuration] = useState(0)
    }
    ```

- 歌词解析

  ```ts
  interface ILyric {
    time: number;
    text: string;
  }

  const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  export function parseLyric(lyricString: string) {
    // 1. 拿到一行行的歌词
    const lines: strings[] = lyricString.split('\n');

    // 2. 对每句歌词进行解析，解析成对应的对象
    const lyrics: ILric[] = [];
    for (const line of lines) {
      // 1. 匹配结果
      const result = timeRegExp.exec(line);
      if (!result) continue;

      // 2. 获取每一组的结果
      const time1 = Number(result[1]) * 60 * 1000;
      const time2 = Number(result[2]) * 60;
      const time3 =
        result[3].length === 3 ? Number(result[3]) : Number(result[3]) * 10;
      const time = time1 + time2 + time3;

      // 3. 获取每一组的文本
      const text = line.replace(timeRegExp, '');

      lyrics.push({ time, text });
    }
    return lyrics;
  }
  ```

- 获取对应时间的那一行歌词
  ```ts
  let index = lyrics.length - 1; // 默认是最后一个
  for (let i = 0; i < lyrics.length; i++) {
    const lyric = lyrics[i];
    if (lyric.time > currentTime) {
      index = i - 1;
      break;
    }
  }
  console.log(lyrics[index].text);
  ```
  - lyricIndex
    - 在多个地方使用 => 在 store 中记录
    - 匹配到相同歌词时，不改变
      ```ts
      if (lyricIndex === index || index === -1) return;
      dispatch(changeLyricIndexAction(index));
      ```
- 播放列表
  ```tsx
  interface IPlayerState {
    currentSong: any;
    lyrics: ILyric[];
    lyricIndex: number;
    playSongList: any[];
    playSongIndex: number;
    playMode: number; // 0: 顺序播放; 1: 随机播放; 2: 单曲循环
  }
  ```
  1. 如果播放列表没有正在播放的那首歌，将其加入
  2. 重构 fetchCurrentSongAction
     1. 准备播放某一首歌曲时，分成两种情况：从列表尝试是否可以获取到这首歌
        - 可以 => 进入步骤 2
        - 不可以 =>
          1.
          2.
  3. 点击 next/previous 图标时
     1. 获取 state 中的数据
     2. 根据播放模式切换 下一首/上一首
        - 即使是单曲循环，此时下一首也是顺序的 the next
        - 注意下标越界问题
     3.
