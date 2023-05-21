import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

export class About extends PureComponent {
  render() {
    const { counter } = this.props;
    return (
      <div>
        <h3>About</h3>
        <span>counter: {counter}</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter
});

const dispatch = (dispatch) => ({
  addNumber(num) {
    dispatch(addNumberAction(num));
  },
  subNumber(num) {
    dispatch(subNumberAction(num));
  }
});

export default connect(mapStateToProps)(About);
