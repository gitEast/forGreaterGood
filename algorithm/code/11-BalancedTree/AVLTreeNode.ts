import TreeNode from './TreeNode';

class AVLTreeNode<T> extends TreeNode<T> {
  left: AVLTreeNode<T> | null = null;
  right: AVLTreeNode<T> | null = null;
  parent: AVLTreeNode<T> | null = null;

  private getHeight(): number {
    const leftHeight = this.left ? this.left.getHeight() : 1;
    const rightHeight = this.right ? this.right.getHeight() : 1;

    return Math.max(leftHeight, rightHeight) + 1;
  }

  // 权重
  private getBalanceFactor(): number {
    const leftHeight = this.left ? this.left.getHeight() : 1;
    const rightHeight = this.right ? this.right.getHeight() : 1;

    return leftHeight - rightHeight;
  }

  get isBalanced() {
    const balanceFactor = this.getBalanceFactor();

    return Math.abs(balanceFactor) <= 1;
  }

  public get higherChild(): AVLTreeNode<T> | null {
    const balanceFactor = this.getBalanceFactor();

    if (balanceFactor > 0) return this.left;
    else if (balanceFactor < 0) return this.right;
    else return this.isLeft ? this.left : this.right;
  }
}

export default AVLTreeNode;
