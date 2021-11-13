<!--
 * @Author: East
 * @Date: 2021-11-13 16:42:12
 * @LastEditTime: 2021-11-13 17:06:08
 * @LastEditors: Please set LastEditors
 * @Description: jsx 写法
 * @FilePath: \forGreaterGood\vue3\17-code\02_jsx\src\App.vue
-->
<script>
import { ref } from 'vue'
import Hello from './Hello.vue'
export default {
  setup() {
    const counter = ref(0)

    const increament = () => counter.value++
    const decreament = () => counter.value--

    return () => {
      return (
        <div>
          <h2>当前计数：{ counter.value }</h2>
          <button onClick={increament}>+1</button>
          <button onClick={decreament}>-1</button>
          <Hello>
            {{ default: props => <button>我是插槽中的按钮</button> }}
          </Hello>
        </div>
      )
    }
  },
  // data() {
  //   return {
  //     counter: 0
  //   }
  // },
  // render() {
  //   const counter = ref(0)

  //   const increament = () => counter.value++
  //   const decreament = () => counter.value--

  //   return (
  //     <div>
  //       <h2>当前计数：{ counter.value }</h2>
  //       <button onClick={increament}>+1</button>
  //       <button onClick={decreament}>-1</button>
  //     </div>
  //   )
  // }
}
</script>

<style>
</style>
