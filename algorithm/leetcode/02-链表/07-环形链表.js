const ListNode = require('./00-ListNode');

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
function detectCycle(head) {}
const ListNode = require('./00-ListNode');

/**
 * 环形链表
 * @param {ListNode} head
 * @return {ListNode}
 */
function detectCycle(head) {
  let fast = head;
  let slow = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (fast === slow) {
      let slow = head;
      while (fast !== slow) {
        fast = fast.next;
        slow = slow.next;
      }
      return fast;
    }
  }

  return null;
}
