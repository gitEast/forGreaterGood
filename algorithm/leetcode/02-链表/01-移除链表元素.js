function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
/**
 * 移除链表元素
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
// function removeElements(head, val) {
//   let prevNode = head;
//   let curNode = head.next;

//   while (curNode) {
//     if (curNode.val === val) {
//       prevNode.next = curNode.next;
//       curNode = prevNode.next;
//     } else {
//       prevNode = curNode;
//       curNode = curNode.next;
//     }
//   }

//   if (head && head.val === val) {
//     if (head.next) {
//       head =  head.next
//     } else return null
//   }

//   return head;
// }
function removeElements(head, val) {
  const virtualHead = new ListNode(0, head);

  let prev = virtualHead;
  let cur = head;
  while (cur) {
    if (cur.val === val) prev.next = cur.next;
    else prev = cur;
    cur = cur.next;
  }

  return virtualHead.next;
}

/**
 * 打印
 * @param {ListNode} head
 */
function print(head) {
  const values = [];
  let cur = head;
  while (cur) {
    values.push(cur.val);
    cur = cur.next;
  }
  console.log(values.join('=>'));
}

// const a7 = new ListNode(6);
// const a6 = new ListNode(5, a7);
// const a5 = new ListNode(4, a6);
// const a4 = new ListNode(3, a5);
// const a3 = new ListNode(6, a4);
// const a2 = new ListNode(2, a3);
// const a1 = new ListNode(1, a2);
// print(a1);
a7 = new ListNode(7);
const a6 = new ListNode(7, a7);
const a5 = new ListNode(7, a6);
const a4 = new ListNode(7, a5);
const a3 = new ListNode(7, a4);
const a2 = new ListNode(7, a3);
const a1 = new ListNode(7, a2);
print(removeElements(a1, 7));
