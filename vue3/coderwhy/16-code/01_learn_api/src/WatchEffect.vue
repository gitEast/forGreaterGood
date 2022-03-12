<!--
 * @Author: your name
 * @Date: 2021-11-13 11:00:04
 * @LastEditTime: 2021-11-13 11:23:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\Watch.vue
-->
<template>
  <div>
    <h2>{{ name }} ---- {{ age }}</h2>
    <button @click="changeName">修改 name</button>
    <button @click="changeAge">修改 age</button>
  </div>
</template>

<script>
import { ref, watch, watchEffect } from 'vue'

export default {
  setup() {
    const name = ref('east')
    const age = ref('22')

    const changeName = () => {
      name.value = 'wind'
    }
    const changeAge = () => {
      age.value++
      if (age.value > 25) {
        stop()
      }
    }

    // // 使用 watchEffect
    // const stop = watchEffect(() => {
    //   console.log(`name: ${name.value}, age: ${age.value}`)
    // })
    const stop = watchEffect((onInvalidate) => {
      onInvalidate(() => {
        // 在这个函数中清除额外的副作用
        // request.cancel()
        console.log('打印一下')
      })
      console.log(`name: ${name.value}, age: ${age.value}`)
    })

    return {
      name, age, changeName, changeAge
    }
  }
}
</script>

<style>
</style>

