<!--
 * @Author: your name
 * @Date: 2021-11-13 13:48:21
 * @LastEditTime: 2021-11-13 14:07:49
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\Watch.vue
-->
<template>
  <div>
    <h2>{{info.name}}----{{info.age}}</h2>
    <button @click="changeAge">修改age</button>
    <h2>{{ age }}</h2>
    <button @click="changeAge2">修改age</button>
  </div>
</template>

<script>
import { ref, watch, reactive } from 'vue'

export default {
  setup() {
    const info = reactive({ name: 'why', age: 18 })

    const changeAge = () => {
      info.age++
    }
    watch(() => info.age, (newValue, oldValue) => {
      console.log('newValue:', newValue, ', oldValue:', oldValue)
    })

    // watch(info, (newValue, oldValue) => {
    //   console.log('newValue:', newValue, ', oldValue:', oldValue)
    // })
    watch(() => {
      return {...info}
    }, (newValue, oldValue) => {
      console.log('newValue:', newValue, ', oldValue:', oldValue)
    })

    const age = ref(22)
    const changeAge2 = () => {
      age.value++
    }
    watch(age, (newValue, oldValue) => {
      console.log('newValue:', newValue, ', oldValue:', oldValue)
    })

    return {
      info,
      changeAge,
      age,
      changeAge2
    }
  }
}
</script>

<style>
</style>
