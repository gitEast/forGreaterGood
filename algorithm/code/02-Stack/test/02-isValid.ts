import ArrayStack from '../ArrayStack';

/**
 * 有效的括号
 */
function isValid(s: string): boolean {
  const stack = new ArrayStack<string>();
  const len = s.length;
  for (let i = 0; i < len; i++) {
    switch (s[i]) {
      case '(':
        stack.push(')');
        break;
      case '[':
        stack.push(']');
        break;
      case '{':
        stack.push('}');
        break;
      default:
        if (s[i] !== stack.pop()) {
          return false;
        }
        break;
    }
  }
  return stack.isEmpty();
}

console.log(isValid('[](){}'));
console.log(isValid('([]){}'));
console.log(isValid('([){}'));
console.log(isValid('([]){}['));

export default isValid;
