import ListNode from './leetcode-ListNode';

function deleteNode(node: ListNode | null): void {
  node!.val = node!.next!.val;
  node!.next = node!.next!.next;
}

export default deleteNode;
