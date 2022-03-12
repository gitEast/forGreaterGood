<!--
 * @Author: your name
 * @Date: 2021-11-13 16:29:37
 * @LastEditTime: 2021-11-13 16:32:54
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\17-code\01_counter_case\src\SetupH.vue
-->
<script>
import { ref, h } from 'vue'

export default {
  setup() {
    const counter = ref(0)

    return () => {
      return h('div', null, [
        h('h2', null, `当前计数：${counter.value}`),
        h('button', {
          onClick: () => counter.value++
        }, '+1'),
         h('button', {
          onClick: () => counter.value--
        }, '-1')
      ])
    }
  }
}
</script>
