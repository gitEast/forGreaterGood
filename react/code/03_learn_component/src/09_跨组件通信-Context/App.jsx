import React, { Component } from 'react';

import Home from './Home';

import ThemeContext from './context/theme-context';
import UserContext from './context/user-context';

export class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ThemeContext.Provider value={{ color: 'red', fontSize: '14px' }}>
          <UserContext.Provider value={{ name: 'east' }}>
            <Home />
          </UserContext.Provider>
        </ThemeContext.Provider>
      </div>
    );
  }
}

export default App;
