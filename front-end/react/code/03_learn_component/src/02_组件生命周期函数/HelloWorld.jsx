import React, { Component } from 'react';

export class HelloWorld extends Component {
  constructor() {
    super();

    this.state = {
      message: 'Hello World!'
    };
    console.log('constructor');
  }

  changeText() {
    this.setState({
      message: 'Hello LifeCycle!'
    });
  }

  render() {
    console.log('render');
    return (
      <div>
        <h2>Hello World!</h2>
        <button>改变文本</button>
      </div>
    );
  }

  componentDidMount() {
    console.log('mounted');
  }
}

export default HelloWorld;
