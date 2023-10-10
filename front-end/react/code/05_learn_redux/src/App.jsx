import React, { PureComponent } from 'react';
import store from './store';

export class App extends PureComponent {
  componentDidMount() {
    store.subscribe(() => {});
  }

  render() {
    return <div>App</div>;
  }
}

export default App;
