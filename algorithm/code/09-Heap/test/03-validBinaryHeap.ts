import BinaryHeap from '../BinaryHeap';

const testArr = [19, 100, 36, 17, 3, 25, 1, 2, 7];

// const heap = new BinaryHeap<number>(undefined, false);

// for (const item of testArr) {
//   heap.insert(item);
// }

// heap.print();

// while (!heap.isEmpty()) {
//   console.log(heap.extract());
// }

const heap = new BinaryHeap<number>(testArr, false);
heap.print();
