/*
 * @Author: your name
 * @Date: 2021-11-07 11:39:59
 * @LastEditTime: 2021-11-08 14:59:10
 * @LastEditors: Please set LastEditors
 * @Description: 入口文件
 * @FilePath: \01_basic_webpack\index.js
 */
import { sum } from "./js/math.js";
const { priceFormat } = require("./js/format.js");
import "./js/element";

// babel test
const names = ["a", "b", "c"];

names.forEach((item) => console.log(item));

console.log(sum(20, 30));
console.log(priceFormat());
