import React, { Component } from 'react';
import Header from './c-cps/Header';
import Main from './c-cps/Main';
import Footer from './c-cps/Footer';

export class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
        <Header />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
