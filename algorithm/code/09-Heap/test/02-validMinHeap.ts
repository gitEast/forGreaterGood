import MinHeap from '../MinHeap';

const testArr = [19, 100, 36, 17, 3, 25, 1, 2, 7];

const heap = new MinHeap<number>();

for (const item of testArr) {
  heap.insert(item);
}

heap.print();

while (!heap.isEmpty()) {
  console.log(heap.extract());
}

// const heap = new MinHeap<number>(testArr);
// heap.print();
