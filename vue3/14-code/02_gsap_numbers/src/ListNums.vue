<!--
 * @Author: your name
 * @Date: 2021-11-12 10:51:40
 * @LastEditTime: 2021-11-12 11:09:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\14-code\02_gsap_numbers\src\List.vue
-->
<template>
  <div id="app">
    <div>
      <transition-group tag="span" name="why">
        <span v-for="i in numbers" :key="i">{{ i }}</span>
      </transition-group>
    </div>
    <button @click="addNum">addNum</button>
    <button @click="removeNum">removeNum</button>
    <button @click="shuffleNum">shuffleNum</button>
  </div>
</template>

<script>
// import gsap from 'gsap'
import _ from 'lodash'
export default {
  name: 'App',
  data() {
    return {
      numbers: [0, 1, 2, 3, 4, 5, 6],
      count: 10
    }
  },
  methods: {
    randomIndex() {
      return Math.floor(Math.random()*this.numbers.length)
    },
    addNum() {

      this.numbers.splice(this.randomIndex(), 0, this.count++)
    },
    removeNum() {
      this.numbers.splice(this.randomIndex(), 1)
    },
    // 数字洗牌
    shuffleNum() {
      this.numbers = _.shuffle(this.numbers)
    }
  },
}
</script>

<style scoped>
span {
  margin: 10px;
  display: inline-block;
}

.why-enter-from, 
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

/* 解决移除突然跳进去的问题 */
.why-leave-active {
  position: absolute;
}
</style>
