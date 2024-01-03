const ListNode = require('./00-ListNode');

// /**
//  * 删除链表的倒数第N个节点
//  * @param {ListNode} head
//  * @param {number} n
//  * @return {ListNode}
//  */
// function removeNthFromEnd(head, n) {
//   if (!head) return head;

//   const virtualHead = new ListNode(0, head);

//   const arr = [];
//   let cur = virtualHead;
//   while (cur) {
//     arr.push(cur);
//     cur = cur.next;
//   }
//   const index = arr.length - n;
//   arr[index - 1].next = arr[index + 1] || null;

//   return virtualHead.next;
// }

/**
 * 删除链表的倒数第N个节点: dummy + 快慢指针
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
function removeNthFromEnd(head, n) {
  const virtualHead = new ListNode(0, head);

  let fast = virtualHead;
  let slow = virtualHead;
  while (n-- > -1) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;

  return virtualHead.next;
}

const a1 = new ListNode(1);
const a2 = new ListNode(2);
const a3 = new ListNode(3);
const a4 = new ListNode(4);
const a5 = new ListNode(5);
a1.next = a2;
a2.next = a3;
a3.next = a4;
a4.next = a5;

let newHead = removeNthFromEnd(a1, 2);
while (newHead) {
  console.log(newHead.val);
  newHead = newHead.next;
}
