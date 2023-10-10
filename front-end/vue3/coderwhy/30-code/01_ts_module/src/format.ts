/*
 * @Author: your name
 * @Date: 2021-11-24 13:47:04
 * @LastEditTime: 2021-11-24 13:49:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\30-code\01_ts_module\src\format.ts
 */
namespace time {
  export function format(time: string) {
    return '2021-11-24'
  }
}

export namespace price {
  export function format() {
    return '$11.17'
  }
}

console.log(time.format('111'))
