import React, { Component } from 'react';

export class MainBanner extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { banners } = this.props;

    return (
      <div>
        <span>MainBanner</span>
        <ul>
          {banners.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MainBanner;
