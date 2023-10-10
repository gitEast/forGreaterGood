import React, { Component } from 'react';

export class MainProductList extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { productList } = this.props;
    return (
      <div>
        <span>MainProductList</span>
        <ul>
          {productList.map((product) => (
            <li>{product}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default MainProductList;
