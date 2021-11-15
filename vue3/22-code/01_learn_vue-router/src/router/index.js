/*
 * @Author: your name
 * @Date: 2021-11-15 11:10:49
 * @LastEditTime: 2021-11-15 14:31:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\22-code\01_learn_vue-router\src\router\index.js
 */
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import About from '../pages/About.vue'

// 映射关系配置
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'msg',
        component: () => import('../pages/home/Msg.vue')
      },
      {
        path: 'shops',
        component: () => import('../pages/home/Shops.vue')
      }
    ]
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/user/:username',
    component: () => import('../pages/User.vue')
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('../pages/NotFound.vue')
  }
]

// 创建路由对象 router
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
