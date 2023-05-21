const store = require('./store');

// 订阅
const unsubscribe = store.subscribe(() => {
  console.log('订阅数据的变化', store.getState());
});

// 取消订阅
unsubscribe();
