import ArrayQueue from '../ArrayQueue';

function lastRemaining(n: number, m: number): number {
  const queue = new ArrayQueue<number>();
  for (let i = 1; i < n + 1; i++) {
    queue.enqueue(i);
  }

  while (queue.size() > 1) {
    for (let i = 1; i < m; i++) {
      queue.enqueue(queue.dequeue()!);
    }
    queue.dequeue();
  }

  return queue.dequeue()!;
}

console.log(lastRemaining(2, 2));

export default lastRemaining;
