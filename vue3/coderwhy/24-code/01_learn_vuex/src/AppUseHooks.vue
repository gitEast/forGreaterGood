<!--
 * @Author: your name
 * @Date: 2021-11-16 09:59:56
 * @LastEditTime: 2021-11-16 14:58:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\24-code\01_learn_vuex\src\App.vue
-->
<template>
  <div>
    <h1>{{name}}</h1>
    <h2>{{age}}</h2>
    <h2>{{counter}}</h2>
    <h1>{{ $store.getters.totalPrice }}</h1>
    <hr>
    <h2>{{counterInfo}}</h2>
    <h2>{{nameInfo}}</h2>
    <h2>{{ageInfo}}</h2>
  </div>
</template>

<script>
import { useState, useGetters } from './hooks/useStore'

export default {
  setup() {
    const storeState = useState(['counter', 'name', 'age'])
    const gettersState = useGetters(['counterInfo', 'nameInfo', 'ageInfo'])

    return {
      ...storeState,
      ...gettersState
    }
  }
}
</script>

<style>
</style>
