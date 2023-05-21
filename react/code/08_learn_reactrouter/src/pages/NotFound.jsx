import React, { PureComponent } from 'react';

export class NotFound extends PureComponent {
  render() {
    return (
      <div>
        <h1>NotFound</h1>
        <p>您进入的路径不存在，请返回首页</p>
      </div>
    );
  }
}

export default NotFound;
