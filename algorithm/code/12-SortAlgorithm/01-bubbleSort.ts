import { swap } from '../utils';

function bubbleSort(list: number[]): number[] {
  const newList = [...list];

  const len = newList.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (newList[j] > newList[j + 1]) {
        swap(newList, j, j + 1);
      }
    }
  }

  return newList;
}

export default bubbleSort;
