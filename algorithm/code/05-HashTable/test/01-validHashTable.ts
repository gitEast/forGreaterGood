import HashTable from '..';

const hashTable = new HashTable<number>();
hashTable.put('aaa', 0);
hashTable.put('aaa', 111);
hashTable.put('bbb', 222);
hashTable.put('ccc', 333);

console.log('------------------ get ------------------');
console.log(hashTable.get('aaa'));
console.log(hashTable.get('bbb'));
console.log(hashTable.get('ccc'));

console.log('------------------ delete ------------------');
console.log(hashTable.delete('aaa'));
console.log(hashTable.delete('bbb'));
console.log(hashTable.delete('000'));

console.log('------------------ resize ------------------');
hashTable.put('aaa', 111);
hashTable.put('bbb', 222);
hashTable.put('ddd', 444);
hashTable.put('eee', 555);
hashTable.printStorage();
hashTable.put('fff', 666);
hashTable.printStorage();
