/*
 * @Author: your name
 * @Date: 2021-11-16 14:12:16
 * @LastEditTime: 2021-11-16 14:57:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\24-code\01_learn_vuex\src\hooks\useState.js
 */
import { useStore, mapState, mapGetters } from "vuex";
import { computed } from 'vue'

export function useState(mapper) {
  return useMapper(mapper, mapState)
}

export function useGetters(mapper) {
  return useMapper(mapper, mapGetters)
}

export function useMapper(mapper, mapFn) {
  const store = useStore()

  const storeStateFns = mapFn(mapper)

  const storeState = {}
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store })
    storeState[fnKey] = computed(fn)
  })

  return storeState
}
