import React, { Component } from 'react';

export class AddCounter extends Component {
  render() {
    const { addClick } = this.props;

    return (
      <div>
        <button onClick={() => addClick(1)}>+1</button>
        <button onClick={() => addClick(5)}>+5</button>
        <button onClick={() => addClick(10)}>+10</button>
      </div>
    );
  }
}

export default AddCounter;
