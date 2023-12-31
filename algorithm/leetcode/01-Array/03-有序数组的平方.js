/**
 * 左右指针
 * @param {Array<Number>} nums
 */
function sortedSquares(nums) {
  const res = new Array(nums.length);

  let left = 0,
    right = nums.length - 1;
  let index = nums.length - 1;

  while (index > -1) {
    const leftNum = nums[left] * nums[left];
    const rightNum = nums[right] * nums[right];
    if (leftNum > rightNum) {
      res[index] = leftNum;
      left++;
    } else {
      res[index] = rightNum;
      right--;
    }
    index--;
  }

  return res;
}

console.log(sortedSquares([-4, -1, 0, 3, 10]));
console.log(sortedSquares([-7, -3, 2, 3, 11]));
