class Graph<T> {
  private verteces: T[] = [];
  private adjoinList: Map<T, T[]> = new Map();

  addVertex(vertex: T): boolean {
    if (this.adjoinList.get(vertex)) return false;
    this.verteces.push(vertex);
    this.adjoinList.set(vertex, []);
    return true;
  }

  addEdge(v1: T, v2: T): boolean {
    const v1Neighbors = this.adjoinList.get(v1);
    const v2Neighbors = this.adjoinList.get(v2);
    if (!v1Neighbors || !v2Neighbors) return false;
    v1Neighbors.push(v2);
    v2Neighbors.push(v1);
    return true;
  }

  traverse() {
    this.verteces.forEach((vertex) => {
      const neighbors = this.adjoinList.get(vertex);
      if (!neighbors) return;
      console.log(`${vertex} => ${neighbors.join(' ')}`);
    });
  }

  bfs() {
    if (!this.verteces.length) return;

    const queue: T[] = [];
    const visited: T[] = [];

    queue.push(this.verteces[0]);
    while (queue.length) {
      const vertex = queue.shift()!;
      if (!visited.includes(vertex)) {
        visited.push(vertex);
        const neighbors = this.adjoinList.get(vertex);
        if (!neighbors) continue;
        queue.push(...neighbors);
      }
    }
    console.log(visited.join(' '));
  }

  dfs() {
    if (!this.verteces.length) return;

    const stack: T[] = [];
    const visited: T[] = [];

    stack.push(this.verteces[0]);
    while (stack.length) {
      const vertex = stack.pop()!;
      if (!visited.includes(vertex)) {
        visited.push(vertex);
        const neighbors = this.adjoinList.get(vertex);
        if (!neighbors) continue;
        for (let i = neighbors.length - 1; i > -1; i--) {
          stack.push(neighbors[i]);
        }
      }
    }
    console.log(visited.join(' '));
  }
}

export default Graph;
