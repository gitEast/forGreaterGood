/*
 * @Author: EastWind linxiayoudongfeng@gmail.com
 * @Date: 2023-02-10 21:16:04
 * @LastEditors: EastWind linxiayoudongfeng@gmail.com
 * @LastEditTime: 2023-02-11 21:01:16
 * @FilePath: \code\04-LinkedList\test\02-reverseLinkedList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import LinkedList from '../LinkedList';
import LinkedNode from '../LinkedNode';

function reverseLinkedListByStack<T>(
  head: LinkedNode<T> | null
): LinkedNode<T> | null {
  if (!head || !head.next) {
    return head;
  }

  const stack: LinkedNode<T>[] = [];
  let current: LinkedNode<T> | null = head;
  while (current) {
    stack.push(current);
    current = current.next;
  }

  let newHead = stack.pop()!;
  let newCurrent: LinkedNode<T> | null = newHead;
  while (stack.length) {
    newCurrent.next = stack.pop()!;
  }
  newCurrent.next = null;

  return head;
}

function reverseLinkedListByWhile<T>(
  head: LinkedNode<T> | null
): LinkedNode<T> | null {
  if (!head || !head.next) {
    return head;
  }
}

const linkedList = new LinkedList<string>();
console.log('------------------------append-------------------------');
linkedList.append('aaa');
linkedList.append('bbb');
linkedList.append('ccc');
linkedList.append('ddd');
linkedList.traverse();
const newHead = reverseLinkedListByStack(linkedList.head);
let current: LinkedNode<string> | null = newHead;
while (current) {
  console.log(current.value);
  current = current.next;
}

export { reverseLinkedListByStack, reverseLinkedListByWhile };
