import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './home.scss';

import Header from '../../components/Header';
import Initiate from '../../components/Initiate';
import DuelList from '../../components/DuelList';
import RankingList from '../../components/RankingList';
import CapitalList from '../../components/CapitalList';
import MiningInfo from '../../components/MiningInfo';
import { Row, Col } from 'antd';

class Home extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
  }
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className={`${styles.content} container`}>
          <Row gutter={10}>
            <Col sm={24} md={12}>
              <Initiate />
            </Col>
            <Col sm={24} md={12}>
              <DuelList />
            </Col>
          </Row>
          <MiningInfo />
          <Row gutter={10}>
            <Col sm={24} md={12}>
              <RankingList />
            </Col>
            <Col sm={24} md={12}>
              <CapitalList />
            </Col>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}

Home.propTypes = {
};


export default connect()(Home);
