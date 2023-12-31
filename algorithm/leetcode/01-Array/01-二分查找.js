/**
 * 未经训练的写法: 注意等于号，特殊用例
 */
/*
function search(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    if (arr[left] < target) left++;
    else if (arr[left] === target) return left;
    if (arr[right] > target) right--;
    else if (arr[right] === target) return right;
  }

  return -1;
}
*/

function search(nums, target) {
  let mid;
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (target < nums[mid]) right = mid - 1;
    else if (target > nums[mid]) left = mid + 1;
    else return mid;
  }
  return -1;
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));
console.log(search([-1, 0, 3, 5, 9, 12], 2));
console.log(search([5], 5));
