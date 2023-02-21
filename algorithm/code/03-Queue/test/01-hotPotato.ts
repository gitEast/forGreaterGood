import ArrayQueue from '../ArrayQueue';

function hotPotato(names: string[], num: number): number {
  if (names.length === 0) return -1;

  const queue = new ArrayQueue<string>();

  for (const name of names) {
    queue.enqueue(name);
  }

  while (queue.size() > 1) {
    for (let i = 1; i < num; i++) {
      queue.enqueue(queue.dequeue()!);
    }
    queue.dequeue();
  }

  const leftName = queue.dequeue()!;
  const index = names.findIndex((name) => name === leftName);
  return index;
}

console.log(hotPotato(['a', 'b'], 3));

export default hotPotato;
