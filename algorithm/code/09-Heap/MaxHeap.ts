import IHeap from './IHeap';

import { cbtPrint } from 'hy-algokit';

class MaxHeap<T> implements IHeap<T> {
  private data: T[];
  private length: number = 0;

  constructor(arr: T[] = []) {
    this.data = arr;
    this.length = arr.length;

    if (this.length > 0) this.buildHeap();
  }

  private swap(i: number, j: number) {
    const temp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = temp;
  }

  insert(value: T): void {
    this.data.push(value);
    this.length++;
    this.percolate_up(this.length - 1);
  }
  private percolate_up(index: number) {
    /* 上滤
     *  1. 与其 parent 节点值比较
     *  2. if > parent.value => 交换位置，获取新 index，并重复步骤 1-3
     *  3. else 跳出循环
     *  4. 循环结束条件： index === 0 即到达根节点
     */

    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.data[parentIndex] >= this.data[index]) {
        break;
      }
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  extract(): T | null {
    if (this.length === 0) return null;
    if (this.length === 1) {
      this.length--;
      return this.data.pop()!;
    }

    const topValue = this.data[0];
    this.data[0] = this.data.pop()!;
    this.length--;

    /* 已完成将最后一个值移至 root 位置，开始下滤
     *  1. 与其 children 节点比较
     *  2. if >= childMax => 跳出循环
     *  3. else 交换位置，获取 新 index，并重复步骤 1-3
     *  4. 循环结束条件：不存在 leftChild 即 是叶子节点
     */
    this.percolate_down(0);

    return topValue;
  }
  private percolate_down(index: number) {
    while (index * 2 + 1 < this.length) {
      const leftChildIndex = index * 2 + 1;
      const rightChildIndex = leftChildIndex + 1;
      let changeIndex = leftChildIndex;
      if (
        rightChildIndex < this.length &&
        this.data[leftChildIndex] < this.data[rightChildIndex]
      ) {
        changeIndex = rightChildIndex;
      }
      if (this.data[index] >= this.data[changeIndex]) {
        break;
      }
      this.swap(index, changeIndex);
      index = changeIndex;
    }
  }

  buildHeap(): void {
    let index = Math.floor(this.length / 2 - 1);
    while (index >= 0) {
      this.percolate_down(index);
      index--;
    }
  }

  peek(): T | null {
    return this.data[0] ?? null;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  print() {
    console.log(this.data);
    cbtPrint(this.data);
  }
}

export default MaxHeap;
