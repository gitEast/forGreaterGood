<!--
 * @Author: your name
 * @Date: 2021-11-16 09:30:12
 * @LastEditTime: 2021-11-16 09:55:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\23-code\01_learn_vuex\src\App.vue
-->
<template>
  <div>
    <div>{{$store.state.counter}}</div>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script>
import store from './store'
export default {
  name: 'App',
  setup() {
    const increment = () => {
      store.commit('increment')
    }
    const decrement = () => {
      store.commit('decrement')
    }

    return {
      increment, decrement
    }
  }
}
</script>

<style>
</style>
