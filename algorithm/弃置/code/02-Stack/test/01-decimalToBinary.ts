import ArrayStack from "../ArrayStack";

function decimalToBinary(decimal: number): string {
  let binary = "";
  const binaryStack = new ArrayStack<number>();

  while (decimal > 0) {
    const remainder = decimal % 2;
    decimal = (decimal - remainder) / 2;
    binaryStack.push(remainder);
  }

  while (!binaryStack.isEmpty()) {
    binary += binaryStack.pop();
  }

  return binary;
}

console.log(decimalToBinary(129));
