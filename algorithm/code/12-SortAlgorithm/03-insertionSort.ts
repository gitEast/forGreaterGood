function insertionSort(arr: number[]): number[] {
  let newArr = [...arr];
  const n = newArr.length;

  for (let i = 1; i < n; i++) {
    const newNum = arr[i];
    let j = i - 1;
    while (newNum > arr[j] && j >= 0) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = newNum;
  }

  return newArr;
}

export default insertionSort;
