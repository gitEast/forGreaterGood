import React, { Component } from 'react';
import NavBar from './nav-bar';

export class App extends Component {
  render() {
    return (
      <div>
        <NavBar>
          <button>search</button>
          <h3>搜索框</h3>
          <span>...</span>
        </NavBar>
      </div>
    );
  }
}

export default App;
