function isSorted(arr: number[]): boolean {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

type SortAlgoFn = (arr: number[]) => number[];

function testSort(sortFn: SortAlgoFn) {
  const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 200));

  console.log('排序前的原数组：', arr);
  const newArr = sortFn(arr);
  console.log('排序后的新数组：', newArr);
  console.log('排序后的顺序是否正确：', isSorted(newArr));
}

export default testSort;
