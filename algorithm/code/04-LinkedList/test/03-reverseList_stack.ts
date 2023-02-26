import ListNode from './leetcode-ListNode';

/**
 * 反转链表 by栈
 */
function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) {
    return head;
  }

  let current: ListNode | null = head;
  let stack: ListNode[] = [];
  while (current) {
    stack.push(current);
    current = current.next;
  }

  const newHead: ListNode = stack.pop()!;
  let newCurrent: ListNode | null = newHead;
  while (stack.length) {
    const node = stack.pop()!;
    newCurrent.next = node;
    newCurrent = node;
  }
  newCurrent.next = null;

  return newHead;
}

const head = new ListNode(0);
head.next = new ListNode(1);
head.next.next = new ListNode(2);

let newHead = reverseList(head);
const newStack: number[] = [];
while (newHead) {
  newStack.push(newHead.val);
  newHead = newHead.next;
}
console.log(newStack.join('==>'));

export default reverseList;
