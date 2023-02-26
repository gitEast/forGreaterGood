import ListNode from './leetcode-ListNode';

/**
 * 反转链表 by循环
 */
function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) {
    return head;
  }

  let current: ListNode | null = null;
  while (head) {
    const temp: ListNode | null = head.next;
    head.next = current;
    current = head;
    head = temp;
  }

  return current;
}

const head = new ListNode(0);
head.next = new ListNode(1);
head.next.next = new ListNode(2);

let newHead = reverseList(head);
const stack: number[] = [];
while (newHead) {
  stack.push(newHead.val);
  newHead = newHead.next;
}
console.log(stack.join('==>'));

export default reverseList;
