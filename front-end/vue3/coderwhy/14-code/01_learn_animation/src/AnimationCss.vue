<!--
 * @Author: your name
 * @Date: 2021-11-11 20:49:33
 * @LastEditTime: 2021-11-12 09:29:31
 * @LastEditors: Please set LastEditors
 * @Description: 使用了内置的 transition 组件 ---- 动画
 * @FilePath: \forGreaterGood\vue3\14-code\01_learn_animation\src\Transition.vue
-->
<template>
  <div class="app">
    <div><button @click="ifShow = !ifShow">Toggle</button></div>

    <transition name="why">
      <div class="hello" v-if="ifShow">Hello World</div>
    </transition>
    <!-- <transition enter-active-class="animate__rubberBand">
      <div class="hello" v-if="ifShow">Hello World</div>
    </transition> -->
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

<style scoped>
.app {
  width: 200px;
  margin: 10px auto;
}
.hello {
  display: inline-block;
}
.why-enter-active {
  animation: bounceInup 2s ease-in;
}

.why-leave-active {
  animation: bounceInup 1s ease-in reverse;
}
</style>
