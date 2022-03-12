<!--
 * @Author: your name
 * @Date: 2021-11-13 10:42:40
 * @LastEditTime: 2021-11-13 10:56:12
 * @LastEditors: Please set LastEditors
 * @Description: computed 和 watch API
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\ComputedWatch.vue
-->
<template>
  <div>
    <h2>单纯 ref：{{firstName}} ---- {{lastName}}</h2>
    <h2>computed: {{fullName}}</h2>
    <button @click="changeName">修改 firstName</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup() {
    const firstName = ref('East')
    const lastName = ref('Wind')

    // const fullName = computed(() => {
    //   return firstName.value + ' ' + lastName.value
    // })
    const fullName = computed({
      get() { return firstName.value + ' ' + lastName.value },
      set(newValue){}
    })
    const changeName = () => {
      firstName.value = '132'
    }

    return {
      firstName,
      lastName,
      fullName,
      changeName
    }
  }
}
</script>

<style>
</style>
