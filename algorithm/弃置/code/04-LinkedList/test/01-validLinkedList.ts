import LinkedList from '../LinkedList';

const linkedList = new LinkedList<string>();
console.log('------------------------append-------------------------');
linkedList.append('aaa');
linkedList.append('bbb');
linkedList.append('ccc');
linkedList.append('ddd');
linkedList.traverse();

console.log('------------------------insert-------------------------');
linkedList.insert(1, '111');
linkedList.insert(2, '222');
linkedList.insert(0, '000');
linkedList.traverse();

console.log('------------------------get-------------------------');
console.log(linkedList.get(1)?.value);
console.log(linkedList.get(2)?.value);

console.log('------------------------indexOf-------------------------');
console.log(linkedList.indexOf('111'));
console.log(linkedList.indexOf('222'));

console.log('------------------------update-------------------------');
console.log(linkedList.update(1, '11111'));
linkedList.traverse();

console.log('------------------------removeAt-------------------------');
console.log(linkedList.removeAt(1)?.value);
linkedList.traverse();

console.log('------------------------remove-------------------------');
console.log(linkedList.remove('222')?.value);
linkedList.traverse();
