/*
 * @Author: your name
 * @Date: 2021-11-07 13:53:32
 * @LastEditTime: 2021-11-07 14:59:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \02_webpack_css\src\js\element.js
 */
import "../css/style.css";
import "../css/title.less";

const divEl = document.createElement("div");
divEl.className = "title";
divEl.innerHTML = "你好啊,李银河";

document.body.appendChild(divEl);
