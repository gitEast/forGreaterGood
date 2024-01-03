const ListNode = require('./00-ListNode.js');
// /**
//  * 两两交换
//  * @param {ListNode} head
//  */
// function swapPairs(head) {
//   if (!head || !head.next) return head;

//   const virtualHead = new ListNode(0, head);
//   let current = head;
//   let prev = virtualHead;
//   while (current) {
//     const remain = current.next.next;
//     const second = current.next;
//     if (!second) break;
//     second.next = current;
//     current.next = remain;
//     current = remain;
//     prev.next = second;
//     prev = second.next;
//   }

//   return virtualHead.next;
// }

/**
 * 两两交换
 * @param {ListNode} head
 */
function swapPairs(head) {
  if (!head || !head.next) return head;

  const virtualHead = new ListNode(0, head);
  let current = virtualHead;
  while (current && current.next && current.next.next) {
    const first = current.next,
      second = current.next.next,
      third = current.next.next.next;
    current.next = second;
    second.next = first;
    first.next = third;
    current = first;
  }

  return virtualHead.next;
}

const a1 = new ListNode(1);
const a2 = new ListNode(2);
const a3 = new ListNode(3);
const a4 = new ListNode(4);
a1.next = a2;
a2.next = a3;
a3.next = a4;

let newHead = swapPairs(a1);
while (newHead) {
  console.log(newHead.val);
  newHead = newHead.next;
}
