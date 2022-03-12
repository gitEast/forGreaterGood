/*
 * @Author: your name
 * @Date: 2021-11-24 14:19:39
 * @LastEditTime: 2021-11-24 14:39:41
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \forGreaterGood\vue3\30-code\01_ts_module\src\declareLodash.ts
 */
// 声明模块
declare module 'lodash' {
  export function join(arr: any[]): void
}

// 声明变量 函数 类
declare let whyName: string
declare let whyAge: number

declare function foo(): void

declare class Person {
  name: string
  age: number
  constructor(name: string, age: number)
}

// 声明文件
declare module '*.jpg'

// 声明命名空间
declare namespace $ {
  export function ajax(settings: any): void
}
