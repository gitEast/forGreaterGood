<!--
 * @Author: your name
 * @Date: 2021-11-13 17:44:50
 * @LastEditTime: 2021-11-13 17:48:23
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\18-code\01_vue3_add\src\局部指令.vue
-->
<template>
  <div>
    <input type="text" ref="input" v-focus>
  </div>
</template>

<script>
  export default {
    directives: {
      focus: {
        mounted(el, bindings, vnode, preVnode) {
          el.focus()
        },
      }
    }
  }
</script>
