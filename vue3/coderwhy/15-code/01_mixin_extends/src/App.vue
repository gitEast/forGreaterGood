<!--
 * @Author: your name
 * @Date: 2021-11-12 13:37:48
 * @LastEditTime: 2021-11-12 14:03:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\01_mixin_extends\src\App.vue
-->
<template>
  <div>
    <h2>{{ msg }}</h2>
    <button @click="learning">click me!</button>
    <h2>{{ title }}</h2>
    <About></About>
  </div>
</template>

<script>
import { demoMixin } from "./mixins/demoMixin"
import About from "./pages/About.vue"
export default {
  name: 'App',
  mixins: [demoMixin],
  data() {
    return {
      msg: 'hello App'
    }
  },
  created() {
    console.log('created!')
  },
  components: {
    About
  }
}
</script>

<style>
</style>
