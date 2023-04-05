import { swap } from '../utils';

function selectionSort(arr: number[]): number[] {
  const newArr = [...arr];
  const n = newArr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (newArr[j] < newArr[minIndex]) minIndex = j;
    }
    if (i !== minIndex) swap(newArr, minIndex, i);
  }

  return newArr;
}

export default selectionSort;
