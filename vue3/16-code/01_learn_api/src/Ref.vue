<!--
 * @Author: your name
 * @Date: 2021-11-13 11:28:44
 * @LastEditTime: 2021-11-13 11:35:17
 * @LastEditors: Please set LastEditors
 * @Description: setup 中使用 ref，绑定 html 标签
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\Ref.vue
-->
<template>
  <div>
    <h2 ref="title">哈哈哈哈</h2>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue'

export default {
  setup() {
    const title = ref(null)

    watchEffect(() => {
      console.log(title.value)
    }, {
      flush: 'post'
    })

    return {
      title
    }
  }
}
</script>

<style>
</style>
