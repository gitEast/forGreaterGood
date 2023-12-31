// function removeElement(nums, val) {
//   let i = 0;
//   while (i < nums.length) {
//     if (nums[i] === val) nums.splice(i, 1);
//     else i++;
//   }
//   return nums.length;
// }

/**
 * 快慢指针
 * @param {Array<Number>} nums
 * @param {Nunmber} val
 */
// function removeElement(nums, val) {
//   let fastIndex = 0,
//     slowIndex = 0;

//   while (fastIndex < nums.length) {
//     if (nums[fastIndex] !== val) {
//       if (fastIndex !== slowIndex) nums[slowIndex] = nums[fastIndex];
//       slowIndex++;
//     }
//     fastIndex++;
//   }
//   return slowIndex;
// }

/**
 * 左右指针
 * @param {Array} nums
 * @param {Number} val
 * @returns {Number}
 */
function removeElement(nums, val) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    if (nums[left] === val) nums[left] = nums[right--];
    else left++;
  }
  return left;
}

console.log(removeElement([3, 2, 2, 3], 3));
console.log(removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2));
