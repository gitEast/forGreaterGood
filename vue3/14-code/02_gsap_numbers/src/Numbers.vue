<!--
 * @Author: your name
 * @Date: 2021-11-12 09:53:52
 * @LastEditTime: 2021-11-12 10:40:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\14-code\02_gsap_numbers\src\App.vue
-->
<template>
  <div id="app">
    <input type="number" step="100" v-model="counter" :min="0">
    <!-- <h2>当前计数：{{ showCounter.toFixed(0) }}</h2> -->
    <h2>当前计数：{{ showNumber.toFixed(0) }}</h2>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'App',
  data() {
    return {
      counter: 0,
      showNumber: 0
    }
  },
  // computed: {
  //   showCounter() {
  //     return this.showNumber.toFixed(0)
  //   }
  // },
  watch: {
    counter(newValue) {
      gsap.to(this, {
        duration: 0.5,
        showNumber: newValue,
      })
    }
  }
}
</script>

<style scoped>
</style>
