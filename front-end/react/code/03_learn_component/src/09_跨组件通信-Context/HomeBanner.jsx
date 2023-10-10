import React, { Component } from 'react';
import ThemeContext from './context/theme-context';
import UserContext from './context/user-context';

export class HomeBanner extends Component {
  render() {
    const { color, fontSize } = this.context;

    return (
      <div>
        <h4>Home Banner</h4>
        <UserContext.Consumer>
          {({ name }) => {
            return (
              <span>
                Banner -- color: {color}, font-size: {fontSize}, name: {name}
              </span>
            );
          }}
        </UserContext.Consumer>
      </div>
    );
  }
}

HomeBanner.contextType = ThemeContext;

export default HomeBanner;
