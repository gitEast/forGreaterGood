<!--
 * @Author: your name
 * @Date: 2021-11-12 14:13:52
 * @LastEditTime: 2021-11-12 15:31:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\02_composition_api\src\App.vue
-->
<template>
  <div>
    <home-page :msg="msg"></home-page>
    <div>
      <!-- <h2>counter: {{ state.counter }}</h2> -->
      <h2>counter: {{ counter }}</h2>
      <button @click="increment">add</button>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import HomePage from "./pages/HomePage.vue"
export default {
  setup(props) {
    // const state = reactive({counter: 100})
    const counter = ref(100)
    const increment = () => {
      // state.counter++
      counter.value++
    }
    const msg = 'hello'
    return {
      // state,
      counter,
      increment,
      msg
    }
  },
  components: {
    HomePage
  }
}
</script>

<style scoped>
</style>
