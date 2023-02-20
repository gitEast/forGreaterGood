import ArrayStack from '../ArrayStack';

/**
 * 十进制转二进制
 */
function decimalToBinary(decimal: number): string {
  const stack = new ArrayStack<number>();

  while (decimal > 0) {
    stack.push(decimal % 2);
    decimal = Math.floor(decimal / 2);
  }

  let res = '';
  while (!stack.isEmpty()) {
    res += stack.pop()!;
  }

  return res;
}

console.log(decimalToBinary(35));
console.log(decimalToBinary(100));

export default decimalToBinary;
