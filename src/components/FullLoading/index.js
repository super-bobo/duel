import React, { Component } from 'react';

import styles from './style.scss';



class FullLoading extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  render() {
    return (
      <div className={styles['full-load']}>
        <div className={styles['loader-wrap']}>
          <div className={styles.wrap}>
            <div className={`${styles['line']} ${styles.line1}`}></div>
            <div className={`${styles['line']} ${styles.line2}`}></div>
            <div className={`${styles['line']} ${styles.line3}`}></div>
          </div>
          <span>LOADING...</span>
        </div>
      </div>
    );
  }
}

export default FullLoading;
