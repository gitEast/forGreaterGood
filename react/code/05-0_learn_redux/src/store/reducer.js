import { CHANGE_NAME, ADD_NUMBER } from './constants';

// 基本数据
const initialState = {
  name: 'east',
  age: 23
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return {
        ...state,
        name: action.name
      };
    default:
      return state;
  }
}

module.exports = reducer;
