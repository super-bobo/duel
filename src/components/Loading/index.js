import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Spin, Row, Col } from 'antd';



class Loading extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
  }
  render() {
    let {loading, children, data, height} = this.props;
    return (
      loading ? (
        <Row type="flex" align="middle" justify="center" style={{height}} className={styles.load}>
          <Col>
            <Spin size="large" />
            <div className={styles.loading}>loading...</div>
          </Col>
        </Row>
      ) : data.length ? children : null
    );
  }
}

export default connect()(Loading);
