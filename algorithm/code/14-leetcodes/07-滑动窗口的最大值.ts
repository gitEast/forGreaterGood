// function maxSlidingWindow(nums: number[], k: number): number[] {
//   const dequeue: number[] = [];
//   const n = nums.length;
//   const res: number[] = [];
//   for (let i = 0; i < n; i++) {
//     if (nums[i] >= dequeue[0]) {
//       while (dequeue.length) dequeue.shift();
//       dequeue.push(nums[i]);
//     } else {
//       if (dequeue.length === k) {
//         dequeue.shift();
//       }
//       dequeue.push(nums[i]);
//       let maxIndex = 0;
//       for (let j = 1; j < dequeue.length; j++) {
//         if (dequeue[maxIndex] <= dequeue[j]) maxIndex = j;
//       }
//       while (maxIndex--) dequeue.shift();
//     }
//     res.push(dequeue[0]);
//   }
//   return res.slice(k - 1);
// }

function maxSlidingWindow(nums: number[], k: number): number[] {
  const n = nums.length;
  // 放索引
  const deque: number[] = [];
  const res: number[] = [];

  for (let i = 0; i < n; i++) {
    // 将元素放入到队列的尾部
    while (deque.length && nums[i] >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }
    deque.push(i);
    // 判断目前队列的头部元素的索引是否在范围之内
    while (deque[0] <= i - k) {
      deque.shift();
    }
    if (i >= k - 1) {
      res.push(nums[deque[0]]);
    }
  }
  return res;
}

console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));

export default maxSlidingWindow;
