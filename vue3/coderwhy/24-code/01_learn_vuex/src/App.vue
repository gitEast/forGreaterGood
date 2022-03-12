<!--
 * @Author: your name
 * @Date: 2021-11-16 09:59:56
 * @LastEditTime: 2021-11-16 14:14:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\24-code\01_learn_vuex\src\App.vue
-->
<template>
  <div>
    <h1>{{name}}</h1>
    <h2>{{age}}</h2>
    <h2>{{counter}}</h2>
  </div>
</template>

<script>
import { useStore, mapState } from 'vuex'
import { computed } from 'vue'

export default {
  setup() {
    const store = useStore()
    const sCounter = computed(() => sotre.state.counter)

    const storeState = mapState(['name', 'counter', 'age'])
    const sStoreState = {}
    Object.keys(storeState).forEach(fnKey => {
      const fn = storeState[fnKey].bind({ $store: store })
      sStoreState[fnKey] = computed(fn)
    })

    return {
      ...sStoreState
    }
  }
}
</script>

<style>
</style>
