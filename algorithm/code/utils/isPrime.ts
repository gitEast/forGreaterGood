function isPrime(num: number): boolean {
  const sqrt = Math.sqrt(num);

  for (let i = 2; i <= sqrt; i++) {
    if (num % i === 0) return false;
  }

  return true;
}

export default isPrime;
