/*
 * @Author: your name
 * @Date: 2021-11-13 10:30:59
 * @LastEditTime: 2021-11-13 10:41:22
 * @LastEditors: Please set LastEditors
 * @Description: 自定义一个 ref，而非系统的 ref
 * @FilePath: \forGreaterGood\vue3\16-code\01_learn_api\src\hook\useDebounceRef.js
 */
import { customRef } from "vue";
export default function (value, delay = 400) {
  let timer = null

  return customRef((track, trigger) => {
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger() // 触发所有的依赖对应的更新
        }, delay);
      }
    }
  })
}
