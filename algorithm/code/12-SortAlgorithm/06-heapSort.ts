import { swap } from '../utils';

function heapSort(arr: number[]): number[] {
  const newArr = [...arr];
  const n = newArr.length;
  buildHeap(newArr);
  for (let i = n - 1; i >= 0; i--) {
    swap(newArr, i, 0);
    heapify_down(0, i - 1);
  }
  return newArr;

  function buildHeap(arr: number[]) {
    const start = Math.floor(arr.length / 2 - 1);
    for (let i = start; i >= 0; i--) heapify_down(i, n);
  }

  function heapify_down(index: number, n: number) {
    while (index * 2 + 1 < n) {
      const leftIndex = index * 2 + 1;
      const rightIndex = leftIndex + 1;
      let largerIndex = leftIndex;
      if (rightIndex < n && newArr[rightIndex] > newArr[leftIndex])
        largerIndex = rightIndex;
      if (newArr[largerIndex] > newArr[index]) swap(newArr, largerIndex, index);
      else break;
      index = largerIndex;
    }
  }
}

export default heapSort;
