<!--
 * @Author: your name
 * @Date: 2021-11-11 20:44:56
 * @LastEditTime: 2021-11-11 20:48:04
 * @LastEditors: Please set LastEditors
 * @Description: 没有任何动画的切换
 * @FilePath: \forGreaterGood\vue3\14-code\01_learn_animation\src\NoPlay.vue
-->
<template>
  <div>
    <button @click="ifShow = !ifShow">Toggle</button>
    <div class="hello" v-if="ifShow">Hello World</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ifShow: true,
    };
  },
};
</script>

<style scoped></style>
