function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

/**
 * 迭代翻转链表
 * @param {ListNode} head
 */
function reverseList(head) {
  // 实际上这行可以不要，已经被下面包括了
  if (!head || !head.next) return head;

  let newHead = null;
  let current = head;
  while (current) {
    const remain = current.next;
    current.next = newHead;
    newHead = current;
    current = remain;
  }

  return newHead;
}

/**
 * 递归翻转链表
 * @param {ListNode} head
 */
function reverseList(head) {
  if (!head || !head.next) return head;

  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;

  return newHead;
}
