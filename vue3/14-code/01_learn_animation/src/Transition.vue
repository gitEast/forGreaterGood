<!--
 * @Author: your name
 * @Date: 2021-11-11 20:49:33
 * @LastEditTime: 2021-11-11 21:40:35
 * @LastEditors: Please set LastEditors
 * @Description: 使用了内置的 transition 组件 ---- 过渡
 * @FilePath: \forGreaterGood\vue3\14-code\01_learn_animation\src\Transition.vue
-->
<template>
  <div>
    <button @click="ifShow = !ifShow">Toggle</button>

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
.why-enter-from,
.why-leave-to {
  opacity: 0;
}

.why-enter-to,
.why-leave-from {
  opacity: 1;
}

.why-enter-active,
.why-leave-active {
  transition: opacity 2s ease;
}
</style>
