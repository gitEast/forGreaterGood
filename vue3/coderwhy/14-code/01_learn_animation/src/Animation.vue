<!--
 * @Author: your name
 * @Date: 2021-11-11 20:49:33
 * @LastEditTime: 2021-11-11 21:39:40
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
/* 帧动画 */
.why-enter-active {
  animation: bounce 2s ease;
}
.why-leave-active {
  animation: bounce 2s reverse;
}

@keyframes bounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
