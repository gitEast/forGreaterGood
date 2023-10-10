<!--
 * @Author: your name
 * @Date: 2021-11-13 10:27:13
 * @LastEditTime: 2021-11-13 10:36:55
 * @LastEditors: Please set LastEditors
 * @Description: customRef 使用
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\App.vue
-->
<template>
  <div>
    <input v-model="message">
    <h2>{{ message }}</h2>
    <div>
      <input v-model="msg">
      <h2>{{ msg }}</h2>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import debounceRef from './hook/useDebounceRef'

export default {
  setup() {
    const message = ref('hello')
    const msg = debounceRef('abc')

    return {
      message,
      msg
    }
  }
}
</script>

<style>
</style>
