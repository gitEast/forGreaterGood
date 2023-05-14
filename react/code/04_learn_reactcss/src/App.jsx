import React, { PureComponent } from 'react';
import AppWrapper from './style';

export class App extends PureComponent {
  render() {
    return (
      <AppWrapper color={'red'} size={'14'}>
        <div className="section">
          <h2 className="title">我是标题</h2>
          <p className="content">我是内容，哈哈哈</p>
        </div>
        <div className="footer">
          <p>免责声明</p>
          <p>版权声明</p>
        </div>
      </AppWrapper>
    );
  }
}

export default App;
