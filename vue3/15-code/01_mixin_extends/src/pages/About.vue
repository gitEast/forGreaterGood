<!--
 * @Author: your name
 * @Date: 2021-11-12 13:59:51
 * @LastEditTime: 2021-11-12 14:01:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\01_mixin_extends\src\pages\About.vue
-->
<template>
  <div>
    <h2>{{ extends }}</h2>
  </div>
</template>
<script>
import BasePage from "./BasePage.vue"
export default {
  extends: BasePage
}
</script>
<style scoped>
  
</style>
