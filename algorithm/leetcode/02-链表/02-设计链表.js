var MyNode = function (val, next) {
  this.val = val === undefined ? '' : val;
  this.next = next === undefined ? null : next;
};
var MyLinkedList = function () {
  this.head = null;
};

/**
 * @param {number} index
 * @return {number}
 */
MyLinkedList.prototype.get = function (index) {
  let curIndex = 0;
  let cur = this.head;
  while (curIndex < index && cur) {
    cur = cur.next;
    curIndex++;
  }
  return cur ? cur.val : -1;
};

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtHead = function (val) {
  const node = new MyNode(val);
  node.next = this.head;
  this.head = node;
};

/**
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtTail = function (val) {
  const node = new MyNode(val);
  let cur = this.head;
  if (!this.head) this.head = node;
  else {
    while (cur.next) cur = cur.next;
    cur.next = node;
  }
};

/**
 * @param {number} index
 * @param {number} val
 * @return {void}
 */
MyLinkedList.prototype.addAtIndex = function (index, val) {
  if (index === 0) {
    this.addAtHead(val);
    return;
  }
  let curIndex = 1;
  let prev = this.head;
  while (curIndex < index) {
    if (!prev) return;
    prev = prev.next;
    curIndex++;
  }
  if (!prev) return;
  const node = new MyNode(val, prev.next);
  prev.next = node;
};

/**
 * @param {number} index
 * @return {void}
 */
MyLinkedList.prototype.deleteAtIndex = function (index) {
  if (!this.head) return;
  if (index === 0) this.head = this.head.next;
  else {
    let curIndex = 1;
    let prev = this.head;
    while (curIndex < index) {
      if (!prev.next) return;
      prev = prev.next;
      curIndex++;
    }
    if (prev.next) prev.next = prev.next.next;
  }
};

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

const myLinkedList = new MyLinkedList();
myLinkedList.addAtHead(1);
myLinkedList.addAtTail(3);
myLinkedList.addAtIndex(1, 2); // 链表变为 1->2->3
console.log(myLinkedList.get(1)); // 返回 2
myLinkedList.deleteAtIndex(1); // 现在，链表变为 1->3
console.log(myLinkedList.get(1));

print(myLinkedList.head);
