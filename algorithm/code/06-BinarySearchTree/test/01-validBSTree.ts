import BSTree from '..';

const bst = new BSTree<number>();
bst.insert(11);
bst.insert(7);
bst.insert(15);
bst.insert(5);
bst.insert(3);
bst.insert(9);
bst.insert(8);
bst.insert(10);
bst.insert(13);
bst.insert(12);
bst.insert(14);
bst.insert(20);
bst.insert(18);
bst.insert(25);
bst.insert(6);
bst.print();
// 搜索
// console.log(bst.search(11));
// console.log(bst.search(15));
// console.log(bst.search(10));
// console.log(bst.search(25));
// console.log(bst.search(2));
// 极值
// console.log(bst.getMinValue());
// console.log(bst.getMaxValue());
// 遍历
// bst.preOrderTraverse((node) => console.log(node.value));
// bst.inOrderTraverse((node) => console.log(node.value));
// bst.postOrderTraverse((node) => console.log(node.value));
// bst.levelOrderTraverse((node) => console.log(node.value));
// 删除
// bst.remove(3);
// bst.remove(25);
// bst.remove(5);
// bst.remove(8);
// bst.remove(9);
// bst.remove(20);
// bst.remove(14);
// bst.remove(13);
// bst.remove(11);
bst.remove(3);
bst.remove(10);
bst.print();
bst.remove(5);
bst.remove(9);
bst.print();
bst.remove(7);
bst.print();
bst.remove(11);
bst.print();
bst.remove(15);
bst.print();
bst.remove(18);
bst.print();
