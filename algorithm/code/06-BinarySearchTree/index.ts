import TreeNode from './TreeNode';
import { btPrint } from 'hy-algokit';

class BSTree<T> {
  private root: TreeNode<T> | null = null;

  insert(value: T) {
    /*
     * 1. root = null
     * 2. root != null
     */
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
    } else {
      this.insertNode(this.root, node);
    }
  }
  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>) {
    if (newNode.value < node.value) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }

  search(value: T): boolean {
    return !!this.searchNode(value);
  }
  private searchNode(value: T) {
    let current: TreeNode<T> | null = this.root;
    let parent: TreeNode<T> | null = null;
    while (current) {
      current.parent = parent;
      if (value === current.value) return current;
      parent = current;
      if (value < current.value) current = current.left;
      else current = current.right;
    }
    return null;
  }

  getMinValue(): T | null {
    let current: TreeNode<T> | null = this.root;
    while (current && current.left) {
      current = current.left;
    }
    return current?.value ?? null;
  }

  getMaxValue(): T | null {
    let current: TreeNode<T> | null = this.root;
    while (current && current.right) {
      current = current.right;
    }
    return current?.value ?? null;
  }

  preOrderTraverse(fn: (node: TreeNode<T>) => void) {
    this.preOrderTraverseNode(this.root, fn);
  }
  private preOrderTraverseNode(
    node: TreeNode<T> | null,
    fn: (node: TreeNode<T>) => void
  ) {
    if (!node) return;
    fn(node);
    this.preOrderTraverseNode(node.left, fn);
    this.preOrderTraverseNode(node.right, fn);
  }

  inOrderTraverse(fn: (node: TreeNode<T>) => void) {
    this.inOrderTraverseNode(this.root, fn);
  }
  private inOrderTraverseNode(
    node: TreeNode<T> | null,
    fn: (node: TreeNode<T>) => void
  ) {
    if (!node) return;
    this.inOrderTraverseNode(node.left, fn);
    fn(node);
    this.inOrderTraverseNode(node.right, fn);
  }

  postOrderTraverse(fn: (node: TreeNode<T>) => void) {
    this.postOrderTraverseNode(this.root, fn);
  }
  private postOrderTraverseNode(
    node: TreeNode<T> | null,
    fn: (node: TreeNode<T>) => void
  ) {
    if (!node) return;
    this.postOrderTraverseNode(node.left, fn);
    this.postOrderTraverseNode(node.right, fn);
    fn(node);
  }

  levelOrderTraverse(fn: (node: TreeNode<T>) => void) {
    if (!this.root) return;
    const stack: TreeNode<T>[] = [this.root];
    while (stack.length) {
      const node = stack.shift()!;
      fn(node);
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
    }
  }

  remove(value: T): boolean {
    const delNode: TreeNode<T> | null = this.searchNode(value);

    if (!delNode) return false;
    let replace: TreeNode<T> | null = null;
    if (!delNode.left && !delNode.right) {
      replace = null;
    } else if (!delNode.left) {
      replace = delNode.right;
    } else if (!delNode.right) {
      replace = delNode.left;
    } else {
      const successor = this.getSuccessor(delNode);
      replace = successor;
      if (delNode.right === successor) {
        successor.left = delNode.left;
      } else {
        successor.parent!.left = successor.right;
        successor.left = delNode.left;
        successor.right = delNode.right;
      }
    }
    if (this.root === delNode) {
      this.root = replace;
    } else {
      if (delNode.isLeft) delNode.parent!.left = replace;
      if (delNode.isRight) delNode.parent!.right = replace;
    }

    return true;
  }
  private getSuccessor(delNode: TreeNode<T>): TreeNode<T> {
    let current: TreeNode<T> = delNode.right!;
    let parrent: TreeNode<T> = delNode;
    while (current.left) {
      parrent = current;
      current = current.left;
      current.parent = parrent;
    }
    return current;
  }

  print() {
    btPrint(this.root);
  }
}

export default BSTree;
