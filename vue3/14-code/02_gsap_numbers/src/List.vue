<!--
 * @Author: your name
 * @Date: 2021-11-12 11:11:43
 * @LastEditTime: 2021-11-12 11:25:47
 * @LastEditors: Please set LastEditors
 * @Description: 列表交替
-->
<template>
  <div id="app">
    <input v-model="keyword">
    <transition-group 
      tag="ul" name="why" 
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave">
      <li v-for="(item, index) in showNames" :key="item" :data-index="index">{{ item }}</li>
    </transition-group>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'App',
  data() {
    return {
      names: ['bac', 'bad', 'ccc', 'cda', 'aaa', 'bbb'],
      keyword: ''
    }
  },
  computed: {
    showNames() {
      return this.names.filter((item) => item.indexOf(this.keyword) !== -1)
    }
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter(el, done) {
      gsap.to(el, {
        opacity: 1,
        height: '1.5em',
        delay: el.dataset.index / 10,
        onComplete: done
      })
    },
    leave(el, done) {
      gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index / 10,
        onComplete: done
      })
    }
  },
}
</script>

<style scoped>
/* .why-enter-from, 
.why-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.why-enter-active,
.why-leave-active {
  transition: all 1s ease;
}

.why-move {
  transition: transform 1s ease;
}

.why-leave-active {
  position: absolute;
} */
</style>
