/**
 * 十进制转二进制
 * @param {Number} decimal
 * @returns {String}
 */
function decimalToBinary(decimal) {
  const stack = [];
  while (decimal) {
    stack.push(decimal % 2);
    decimal = decimal >> 1;
  }

  let res = '';
  while (stack.length) {
    res += stack.pop();
  }
  return res;
}

console.log(decimalToBinary(35));
console.log(decimalToBinary(100));
