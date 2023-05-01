import React from 'react';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      message: 'Hello React Scaffold!'
    };
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
