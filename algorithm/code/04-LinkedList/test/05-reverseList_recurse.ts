import ListNode from './leetcode-ListNode';

/**
 * 反转链表 by循环
 */
function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) {
    return head;
  }

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null

  return newHead;
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
