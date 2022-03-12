<!--
 * @Author: your name
 * @Date: 2021-11-12 14:26:02
 * @LastEditTime: 2021-11-12 14:51:32
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\02_composition_api\src\pages\HomePage.vue
-->
<template>
  <div>
    <h2>{{ msg }}</h2>
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  },
  setup(props) {
    console.log(props)
    return {
      msg: props.msg
    }
  }
}
</script>
<style scoped>
  
</style>
