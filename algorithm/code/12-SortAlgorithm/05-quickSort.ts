import { swap } from '../utils';

// function quickSort(
//   arr: number[],
//   start: number | undefined = undefined,
//   end: number | undefined = undefined
// ): number[] {
//   const n = arr.length;
//   if (!start) start = 0;
//   if (!end) end = n - 1;
//   if (start >= end) return [];
//   const pivot = arr[end];

//   let i = start;
//   let j = end - 1;
//   while (i <= j) {
//     while (arr[i] < pivot) i++;
//     while (arr[j] > pivot) j--;
//     if (i <= j) {
//       swap(arr, i, j);
//     }
//   }
//   swap(arr, i, end);
//   quickSort(arr, start, j);
//   quickSort(arr, i + 1, end);

//   return arr;
// }

function quickSort(arr: number[]): number[] {
  const newArr = [...arr];

  partition(0, newArr.length - 1);

  function partition(left: number, right: number) {
    if (left >= right) return;

    const pivot = newArr[right];

    let i = left;
    let j = right - 1;
    while (i <= j) {
      if (newArr[i] < pivot) i++;
      if (newArr[j] > pivot) j--;
      if (i <= j) swap(newArr, i, j);
    }
    swap(newArr, i, right);
    partition(left, j);
    partition(i + 1, right);
  }

  return newArr;
}

export default quickSort;
