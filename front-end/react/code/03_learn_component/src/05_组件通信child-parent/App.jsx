import React, { Component } from 'react';
import AddCounter from './AddCounter';
import SubCounter from './SubCounter';

export class App extends Component {
  constructor() {
    super();

    this.state = { counter: 0 };
  }

  changeCounter(count) {
    this.setState({
      counter: this.state.counter + count
    });
  }

  render() {
    const { counter } = this.state;
    return (
      <div>
        <h2>Counter: {counter}</h2>
        <AddCounter addClick={(count) => this.changeCounter(count)} />
        <SubCounter addClick={(count) => this.changeCounter(count)} />
      </div>
    );
  }
}

export default App;
