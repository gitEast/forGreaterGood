import React, { PureComponent } from 'react';
import withTheme from '../hoc/with_theme';

export class Product extends PureComponent {
  render() {
    const { color, size } = this.props;
    return (
      <div>
        <h3>Product Component</h3>
        <span>
          color-{color}, size-{size}
        </span>
      </div>
    );
  }
}

export default withTheme(Product);
