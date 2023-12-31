/**
 * 螺旋矩阵
 * @param {Number} n
 */
function generateMatrix(n) {
  // 1. 创建一个二维数组
  const res = new Array(n);
  for (let i = 0; i < n; i++) {
    res[i] = new Array(n);
  }

  // 2. 设置需要的变量
  let startX = 0,
    startY = 0; // 每一个圈的起始位置
  let loop = n >> 1; // 循环几圈
  let mid = n >> 1; // 矩阵中间的位置，偶数不用管，奇数需要另外赋值
  let count = 1; // 每个空格要赋的值
  let offset = 1; // 控制每条边遍历的长度，每次循环边界收缩一位

  // 3. 画圈
  while (loop--) {
    let x = startX,
      y = startY; // 本次循环中的 x, y 值

    // 3.1 上行的从左到右
    while (y < n - offset) {
      res[startX][y] = count++;
      y++;
    }

    // 3.2 右列的从上到下
    while (x < n - offset) {
      res[x][y] = count++;
      x++;
    }

    // 3.3 下行的从右到左
    while (y > startY) {
      res[x][y] = count++;
      y--;
    }

    // 3.4 左列的从下到上
    while (x > startX) {
      res[x][y] = count++;
      x--;
    }

    startX++;
    startY++;
    offset++;
  }

  if (n % 2) {
    res[mid][mid] = count;
  }

  return res;
}

// console.log(generateMatrix(4));
console.log(generateMatrix(3));
// console.log(generateMatrix(2));
console.log(generateMatrix(1));
