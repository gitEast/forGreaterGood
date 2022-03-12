/*
 * @Author: east
 * @Date: 2021-11-07 13:53:32
 * @LastEditTime: 2021-11-07 18:27:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \02_webpack_css\src\js\element.js
 */
import "../css/style.css";
import "../css/title.less";
import "../css/image.css";
import imgSrc from "../img/zznh.png";
import "../font/iconfont.css";

const divEl = document.createElement("div");
divEl.className = "title";
divEl.innerHTML = "你好啊,李银河";

// 设置背景图片
const bgDivEl = document.createElement("div");
bgDivEl.className = "image-bg";

//设置 img 元素的 src
const imgEl = document.createElement("img");
imgEl.src = imgSrc;

// i 元素
const iEl = document.createElement("i");
iEl.className = "iconfont icon-ashbin";

document.body.appendChild(divEl);
document.body.appendChild(bgDivEl);
document.body.appendChild(imgEl);
document.body.appendChild(iEl);
