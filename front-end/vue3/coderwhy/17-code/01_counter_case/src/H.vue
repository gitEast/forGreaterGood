<!--
 * @Author: your name
 * @Date: 2021-11-13 16:19:05
 * @LastEditTime: 2021-11-13 16:25:42
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\17-code\01_counter_case\src\H.vue
-->
<script>
  import { h } from 'vue'

  export default {
    render() {
      return h('h2', { class: 'title' }, 'hello')
    },
  }
</script>

<style>
  .title {
    color: red
  }
</style>
