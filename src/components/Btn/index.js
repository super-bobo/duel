import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Icon } from 'antd';



class Btn extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  clickHandler() {
    let {loading, onClick} = this.props;
    if(loading) return false;
    onClick && onClick();
  }
  render() {
    let {loading, children, type = 'submit'} = this.props;
    // type { cancel submit duel }
    return (
      <div className={`${styles.btn} ${styles[type]} ${!!loading ? styles.loading : null}`} onClick={() => this.clickHandler()}>
       {!!loading && <Icon type="loading" />} {children}
      </div>
    );
  }
}

export default connect()(Btn);
