/*
 * @Author: your name
 * @Date: 2021-11-24 11:28:06
 * @LastEditTime: 2021-11-24 14:38:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\30-code\01_ts_module\src\main.ts
 */
import './declareLodash'
import axios from 'axios'
import _ from 'lodash'
import { price } from './format'

let msg: string = 'hello'

console.log(msg)
console.log(price.format())
axios.get('http://123.207.32.32:8000/home/multidata').then(res => {
  console.log(res)
})

console.log(_.join([1, 2, 3]))
