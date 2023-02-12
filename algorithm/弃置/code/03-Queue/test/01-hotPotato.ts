import ArrayQueue from "../ArrayQueue";

function hotPotato(names: string[], num: number): string {
  const queue = new ArrayQueue<string>();

  names.forEach(name => queue.enqueue(name));

  while (queue.size() > 1) {
    for (let i = 1; i < num; i++) {
      queue.enqueue(queue.dequeue()!);
    }

    queue.dequeue();
  }

  return queue.dequeue()!;
}

export default hotPotato;
