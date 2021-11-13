/*
 * @Author: your name
 * @Date: 2021-11-13 15:15:28
 * @LastEditTime: 2021-11-13 15:19:11
 * @LastEditors: Please set LastEditors
 * @Description: 修改网页 title
 * @FilePath: \forGreaterGood\vue3\17-code\01_counter_case\src\hooks\useTitle.js
 */
import { ref, watch } from 'vue'
export default function(title = 'defaultTitle') {
  const titleRef = ref(title)

  watch(titleRef, (newValue) => {
    document.title = newValue
  }, {
    immediate: true
  })

  return titleRef
}
