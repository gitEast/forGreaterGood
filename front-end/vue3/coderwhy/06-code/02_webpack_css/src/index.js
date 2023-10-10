/*
 * @Author: your name
 * @Date: 2021-11-07 11:39:59
 * @LastEditTime: 2021-11-07 14:02:05
 * @LastEditors: Please set LastEditors
 * @Description: 入口文件
 * @FilePath: \01_basic_webpack\index.js
 */
import { sum } from "./js/math.js";
const { priceFormat } = require("./js/format.js");
import "./js/element";

console.log(sum(20, 30));
console.log(priceFormat());
