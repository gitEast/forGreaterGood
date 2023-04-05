import AVLTreeNode from '../AVLTreeNode';

const node = new AVLTreeNode<number>(20);
node.right = new AVLTreeNode<number>(15);
node.right.right = new AVLTreeNode<number>(10);

console.log(node.isBalanced);
console.log(node.right.isBalanced);
console.log(node.right.isBalanced);
console.log(node.higherChild);
