function mergeSort(arr: number[]): number[] {
  if (arr.length === 1) return arr;

  const middle = Math.ceil(arr.length / 2);
  const childArr1 = mergeSort(arr.slice(0, middle));
  const childArr2 = mergeSort(arr.slice(middle));

  const newArr: number[] = [];
  let i = 0;
  let j = 0;
  while (i < childArr1.length && j < childArr2.length) {
    if (childArr1[i] < childArr2[j]) {
      newArr.push(childArr1[i]);
      i++;
    } else {
      newArr.push(childArr2[j]);
      j++;
    }
  }

  if (i < childArr1.length) {
    newArr.push(...childArr1.slice(i));
  }

  if (j < childArr2.length) {
    newArr.push(...childArr2.slice(j));
  }

  return newArr;
}

export default mergeSort;
