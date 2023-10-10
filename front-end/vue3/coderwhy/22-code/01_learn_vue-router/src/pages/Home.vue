<!--
 * @Author: your name
 * @Date: 2021-11-15 11:09:44
 * @LastEditTime: 2021-11-15 14:30:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\22-code\01_learn_vue-router\src\pages\Home.vue
-->
<template>
  <div>
    <h2>Home</h2>
    <div>
      <router-link to="/home/msg">消息</router-link>
    </div>
    <div>
      <router-link to="/home/shops">商品</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  
}
</script>
<style scoped>
  
</style>
