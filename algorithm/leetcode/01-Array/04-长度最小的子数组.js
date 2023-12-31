/**
 * 滑动窗口
 * @param {Number} target
 * @param {Array<Number>} nums
 * @returns Number
 */
function minSubArrayLen(target, nums) {
  let start = 0,
    end = 0;
  let res = nums.length + 1,
    sum = 0;
  while (end < nums.length) {
    sum += nums[end];
    while (sum >= target) {
      const length = end - start + 1;
      res = length < res ? length : res;
      sum -= nums[start];
      start++;
    }
    end++;
  }
  return res > nums.length ? 0 : res;
}

console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]));
console.log(minSubArrayLen(4, [1, 4, 4]));
console.log(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]));
