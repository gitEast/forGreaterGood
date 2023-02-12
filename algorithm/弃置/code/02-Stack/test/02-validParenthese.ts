import ArrayStack from "../ArrayStack";

function validParenthese(str: string): boolean {
  const parentheseStack = new ArrayStack<string>();

  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case "(":
        parentheseStack.push(")");
        break;
      case "[":
        parentheseStack.push("]");
        break;
      case "{":
        parentheseStack.push("}");
        break;
      default:
        if (str[i] !== parentheseStack.pop()) return false;
        break;
    }
  }

  return parentheseStack.isEmpty();
}

console.log(validParenthese("(){}[]"));
console.log(validParenthese("({})[]"));
console.log(validParenthese("({)}[]"));
