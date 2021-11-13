/*
 * @Author: your name
 * @Date: 2021-11-13 15:09:54
 * @LastEditTime: 2021-11-13 15:09:55
 * @LastEditors: Please set LastEditors
 * @Description: counter 计数 的逻辑
 * @FilePath: \forGreaterGood\vue3\17-code\01_counter_case\src\hooks\useCounter.js
 */
import { ref, computed } from 'vue'

export default function() {
  const counter = ref(0)
  const doubleCounter = computed(() => counter.value * 2)

  const increment = () => counter.value++
  const decrement = () => counter.value--

  return {
    counter, doubleCounter, increment, decrement
  }
}
