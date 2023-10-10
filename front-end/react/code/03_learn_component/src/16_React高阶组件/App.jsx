import React, { PureComponent } from 'react';
import ThemeContext from './context/theme-context';
import Product from './pages/Product';

export class App extends PureComponent {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ThemeContext.Provider value={{ color: 'red', size: '14px' }}>
          <Product />
        </ThemeContext.Provider>
      </div>
    );
  }
}

export default App;
