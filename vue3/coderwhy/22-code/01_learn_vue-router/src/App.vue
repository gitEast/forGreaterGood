<!--
 * @Author: your name
 * @Date: 2021-11-15 11:08:19
 * @LastEditTime: 2021-11-15 14:43:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\22-code\01_learn_vue-router\src\App.vue
-->
<template>
  <div>
    <h2>哈哈哈哈</h2>
    <h2>呵呵呵呵</h2>
    <div>
      <router-link to='/home'>home</router-link>
    </div>
    <router-link to='/about'>about</router-link>
    <div>
      <router-link to='/user/why'>user</router-link>
    </div>
    <button @click="jumpTo('/home')">首页</button>
    <button @click="jumpTo('/about')">关于</button>
    <router-view></router-view>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'App',
  // methods: {
  //   jumpTo(url) {
  //     this.$router.push(url)
  //   }
  // },
  setup() {
    const router = useRouter()
    const jumpTo = (url) => {
      router.push(url)
    }

    return {
      jumpTo
    }
  }
}
</script>

<style>
</style>
