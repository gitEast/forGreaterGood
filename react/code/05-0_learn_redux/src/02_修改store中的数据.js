const store = require('./store');

const nameAction = { type: 'change_name', name: 'wind' };
store.dispatch(nameAction);
