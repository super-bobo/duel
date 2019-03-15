import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './home.scss';

import Header from '../../components/Header';
import Initiate from '../../components/Initiate';
import DuelList from '../../components/DuelList';
import RankingList from '../../components/RankingList';
import CapitalList from '../../components/CapitalList';
import MiningInfo from '../../components/MiningInfo';
import ChatRoom from '../../components/ChatRoom';
import { Row, Col, Icon } from 'antd';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      chatShow: false
    }
  }
  componentDidMount() {
  }
  toggleChat(bol) {
    this.setState({chatShow: bol});
  }
  render() {
    let { chatShow } = this.state;
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
          <div className={styles['chat-btn']}>
            <div onClick={() => this.toggleChat(true)} >
              <Icon type="message"/>
            </div>
          </div>
        </div>
        <ChatRoom onClick={this.toggleChat.bind(this)} show={chatShow}  />
      </React.Fragment>
    );
  }
}

Home.propTypes = {
};


export default connect()(Home);
