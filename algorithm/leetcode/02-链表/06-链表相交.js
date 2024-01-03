const ListNode = require('./00-ListNode');

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
function getIntersectionNode(headA, headB) {
  let lenA = 0;
  let lenB = 0;

  let curA = headA;
  while (curA) {
    curA = curA.next;
    lenA++;
  }
  let curB = headB;
  while (curB) {
    curB = curB.next;
    lenB++;
  }

  let fast, slow, difference;
  if (lenA > lenB) {
    difference = lenA - lenB;
    fast = headA;
    slow = headB;
  } else {
    difference = lenB - lenA;
    fast = headB;
    slow = headA;
  }
  while (difference--) fast = fast.next;
  while (fast && slow) {
    if (fast === slow) return fast;
    fast = fast.next;
    slow = slow.next;
  }
  return null;
}
