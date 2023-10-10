import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';

import './style.css';

export class App extends PureComponent {
  constructor() {
    super();

    this.state = { isShow: true };
  }

  render() {
    const { isShow } = this.state;
    return (
      <div>
        <button>切换</button>
        <CSSTransition
          in={isShow}
          unmountOnExit={true}
          className="east"
          timeout={2000}
        >
          <h2>哈哈哈哈</h2>
        </CSSTransition>
      </div>
    );
  }
}

export default App;
