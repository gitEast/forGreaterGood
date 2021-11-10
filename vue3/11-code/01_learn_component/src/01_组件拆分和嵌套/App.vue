<!--
 * @Author: East
 * @Date: 2021-11-10 14:12:07
 * @LastEditTime: 2021-11-10 14:40:04
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\11-code\01_learn_component\src\01_组件拆分和嵌套\App.vue
-->
<template>
  <div id="app">
    <Header></Header>
    <div class="main">
      <h2>Banner</h2>
      <ul>
        <li>商品信息1</li>
        <li>商品信息2</li>
        <li>商品信息3</li>
        <li>商品信息4</li>
        <li>商品信息5</li>
      </ul>
    </div>
    <div class="footer">
      <h2>Footer</h2>
    </div>
  </div>
</template>
<script>
  import Header from './Header.vue'
  export default {
    components: {
      Header
    }
  }
</script>
<style scoped>
  h2 {
    color: red
  }
</style>
