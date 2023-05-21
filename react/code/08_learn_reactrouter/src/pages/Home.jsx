import React, { PureComponent } from 'react';
import { Outlet } from 'react-router-dom';

export class Home extends PureComponent {
  render() {
    return (
      <div>
        <h3>Home</h3>
        <Outlet />
      </div>
    );
  }
}

export default Home;
