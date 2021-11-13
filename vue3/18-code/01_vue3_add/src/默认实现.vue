<!--
 * @Author: East
 * @Date: 2021-11-13 17:12:09
 * @LastEditTime: 2021-11-13 17:43:21
 * @LastEditors: Please set LastEditors
 * @Description: 自定义指令
 * @FilePath: \forGreaterGood\vue3\18-code\01_vue3_add\src\App.vue
-->
<template>
  <div>
    <input type="text" ref="input">
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
export default {
  setup() {
    const input = ref(null)

    onMounted(() => {
      input.value.focus()
    })

    return { input }
  }
}
</script>

<style>

</style>
