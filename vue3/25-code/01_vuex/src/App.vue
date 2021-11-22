<!--
 * @Author: your name
 * @Date: 2021-11-19 10:31:21
 * @LastEditTime: 2021-11-19 11:12:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\25-code\01_vuex\src\App.vue
-->
<template>
  <div>
    <h2>$store.state.counter: {{ $store.state.counter }}</h2>
    <h2>store.state.counter: {{ store.state.counter }}</h2>
    <h2>counter: {{ counter }}</h2>
  </div>
</template>

<script>
import { useStore, mapState } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'App',
  setup() {
    const store = useStore()
    const counter = computed(mapState(['counter'])['counter'].bind({ $store: store}))
    return {
      store,
      counter
    }
  }
}
</script>

<style>
</style>
