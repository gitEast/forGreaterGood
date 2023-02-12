import IStack from "./IStack";

class ArrayStack<T> implements IStack<T> {
  stack: T[] = [];

  push(element: T): boolean {
    try {
      this.stack.push(element);
      return true;
    } catch (error) {
      return false;
    }
  }

  pop(): T | null {
    const element = this.stack.pop();
    return element ?? null;
  }

  peek(): T | null {
    return this.stack[0];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}

export default ArrayStack;
