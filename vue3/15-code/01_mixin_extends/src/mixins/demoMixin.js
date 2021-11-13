/*
 * @Author: your name
 * @Date: 2021-11-12 13:38:54
 * @LastEditTime: 2021-11-12 13:40:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\15-code\01_mixin_extends\src\mixins\demoMixin.js
 */
export const demoMixin = {
  data() {
    return {
      msg: 'I\'m working for my goal'
    }
  },
  methods: {
    learning() {
      console.log("I'm learning now.")
    }
  },
  created() {
    console.log('hello')
  },
}
