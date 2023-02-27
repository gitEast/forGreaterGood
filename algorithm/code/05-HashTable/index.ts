import isPrime from '../utils/isPrime';

class HashTable<T = any> {
  private storage: [string, T][][] = [];
  private length = 7;
  private count = 0;

  private BASE = 31;

  private hashFunc(key: string): number {
    let hashCode = 0;

    for (let i = 0; i < key.length; i++) {
      hashCode = hashCode * this.BASE + key.charCodeAt(i);
    }

    hashCode = hashCode % this.length;

    return hashCode;
  }

  private getNextPrime(num: number): number {
    let newNum = num;
    while (!isPrime(newNum)) {
      newNum++;
    }
    return newNum;
  }

  private resize(newLength: number): void {
    if (newLength < 7) return;
    const oldStorage = this.storage;
    this.storage = [];
    this.length = this.getNextPrime(newLength);
    this.count = 0;

    oldStorage.forEach((bucket) => {
      bucket.forEach((tuple) => this.put(tuple[0], tuple[1]));
    });
  }

  put(key: string, value: T) {
    const index = this.hashFunc(key);

    if (!this.storage[index]) {
      this.storage[index] = [];
    }

    const bucket = this.storage[index];

    for (const tuple of bucket) {
      if (tuple[0] === key) {
        tuple[1] = value;
        return;
      }
    }

    bucket.push([key, value]);

    this.count++;

    const loadFactor = this.count / this.length;
    if (loadFactor > 0.75) {
      this.resize(this.length * 2);
    }
  }

  get(key: string): T | undefined {
    const index = this.hashFunc(key);
    const bucket = this.storage[index];

    if (!bucket) return undefined;

    for (const tuple of bucket) {
      if (tuple[0] === key) {
        return tuple[1];
      }
    }

    return undefined;
  }

  delete(key: string): T | undefined {
    const index = this.hashFunc(key);
    const bucket = this.storage[index];

    if (!bucket) return undefined;

    for (let i = 0; i < bucket.length; i++) {
      const tuple = bucket[i];
      if (tuple[0] === key) {
        bucket.splice(i, 1);
        this.count--;

        const loadFactor = this.count / this.length;
        if (loadFactor < 0.25) {
          this.resize(Math.floor(this.length / 2));
        }

        return tuple[1];
      }
    }

    return undefined;
  }

  printStorage() {
    console.log(this.storage);
  }
}

export default HashTable;
