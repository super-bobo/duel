import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Icon } from 'antd';



class Refresh extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  render() {
    let { onClick } = this.props;
    // type { cancel submit duel }
    return (
      <div className={styles['loading-wrap']} onClick={()=> onClick()}>
        <Icon type="reload" />
      </div>
    );
  }
}

export default connect()(Refresh);
