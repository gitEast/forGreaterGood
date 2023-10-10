import React, { Component } from 'react';

import HelloWorld from './HelloWorld';

export class App extends Component {
  render() {
    return (
      <div>
        <h1>App 组件</h1>
        <HelloWorld />
      </div>
    );
  }
}

export default App;
