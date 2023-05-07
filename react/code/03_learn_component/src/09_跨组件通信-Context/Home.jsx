import React, { Component } from 'react';
import HomeInfo from './HomeInfo';
import HomeBanner from './HomeBanner';

export class Home extends Component {
  render() {
    return (
      <div>
        <h2>Home</h2>
        <HomeInfo />
        <HomeBanner />
      </div>
    );
  }
}

export default Home;
