import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';



class OverContainer extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  render() {
    let {height, children} = this.props;
    return (
      <div className={styles.container} style={{height: height}}>
        {children}
      </div>
    );
  }
}

export default connect()(OverContainer);
