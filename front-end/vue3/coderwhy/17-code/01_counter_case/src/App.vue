<template>
  <div>
    <h2>当前计数：{{ counter }}</h2>
    <h2>当前计数 * 2：{{ doubleCounter }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script>
import useCounter from './hooks/useCounter'
import useTitle from './hooks/useTitle'

export default {
  name: 'App',
  setup() {
    const { counter, doubleCounter, increment, decrement } = useCounter()

    const titleRef = useTitle('coderwhy')
    setTimeout(() => {
      titleRef.value = 'cookie'
    }, 1000)

    return {
      counter, doubleCounter, increment, decrement
    }
  }
}
</script>

<style>
</style>
