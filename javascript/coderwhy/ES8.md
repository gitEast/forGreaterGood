<!--
 * @Author: your name
 * @Date: 2021-10-24 10:36:14
 * @LastEditTime: 2021-10-24 10:50:02
 * @LastEditors: Please set LastEditors
 * @Description: ES8
 * @FilePath: \知识点\ES8.md
-->

# ES8

## Object

- Object.values()
- Object.entries
  - {name: 'why'} → \[\['name', 'why']]
- Object.getOwnPropertyDescriptor()

## String Padding 字符串填充

- padStart
  ```js
  const msg = "hello world";
  const newMsg = msg.padStart(15);
  console.log(newMsg); // '    hello world'
  const newMsg2 = msg.padStart(15, "*");
  console.log(newMsg2); // '****hello world'
  ```
- padEnd

## async 异步
