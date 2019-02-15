import React, { Component } from 'react';
import { connect } from 'dva';

import { getUrlParam } from '../../utils/Tool';

import styles from './style.scss';

import { Tabs, Table, Row, Col, message } from 'antd';
import PartContainer from '../PartContainer';
import Loading from '../Loading';
import Btn from '../Btn';

import { joinDuel, cancelDuel } from '../../api/tronApi';

const TabPane = Tabs.TabPane;


class DuelList extends Component {
  constructor(props) {
    super(props);
    const {langInfo: {lang}} = this.props;
    this.state = {
      currentKey: -1,
      columns: [
        {
          title: lang['duel.supply'],
          dataIndex: 'creator',
          width: '45%',
          align: 'center',
          render: (text, record) => {
            let boxText = (type) => {
              switch (record.finished) {
                case 0:
                  if(record.cancel === 0) {
                    return <span>{record.creatorOption === type ? record.creator : record.join}</span>;
                  } else {
                    return <span>{record.creatorOption === type ? record.creator : null}</span>;
                  }
                  case 1:
                    return <span>{record.creatorOption === type ? record.creator : record.join}</span>;
                default:
                  break;
              }
            };

            return (
              <Row className={styles['table-left']} type="flex" align="middle" justify="center">
                <Col className={styles.left}>
                  <img src={require('../../assets/images/g_box.png')} />
                  <div className={this.activeClass(record.creatorOption, 0, record.type)}>{boxText(0)}</div>
                </Col>
                <Col className={styles.center}><span>vs</span></Col>
                <Col className={styles.right}>
                  <img src={require('../../assets/images/s_box.png')} />
                  <div className={this.activeClass(record.creatorOption, 1, record.type)}>{boxText(1)}</div>
                </Col>
              </Row>
            );
          }
        },{
          title: 'TRX',
          dataIndex: 'bean',
          width: '15%',
          align: 'center',
          render: (text, record) => {
            return (
              <React.Fragment>
                <img className={styles.coin} src={require('../../assets/images/coin.png')} />
                <div>{record.bean}</div>
              </React.Fragment>
            )
          }
        },{
          title: lang['duel.victory'],
          dataIndex: 'name',
          width: '18%',
          align: 'center',
          render: (text, record) => {
            switch (record.finished) {
              case 0:
              return (
                <div>
                  <img className={styles.coin} src={require('../../assets/images/fire.png')} />
                  <div>{lang['duel.preparation']}</div>
                </div>
              );
              case 1:
                if(record.cancel === 0) {
                  return (
                    <div>
                      <img className={styles.coin} src={require(`../../assets/images/${record.resultOption === 0 ? 'g': 's'}_box_open.png`)} />
                      <div className={this.activeClass(record.creatorOption, record.resultOption, record.type)}>{record.win}</div>
                    </div>
                  );
                } else {
                  return <span>--</span>;
                }
              default:
                return null;
            }
          }
        },{
          title: '',
          dataIndex: '',
          align: 'center',
          render: (text, record) => {
            let { currentKey } = this.state;
            switch (record.finished) {
              case 0:
                if(record.type === 1) {
                  return <Btn type="cancel" onClick={() => this.cancel(record)} loading={currentKey === record.id}>{lang['duel.cancel']}</Btn>;
                } else {
                  return <Btn type="duel" onClick={() => this.battle(record)} loading={currentKey === record.id}>{lang['duel.duel']}</Btn>;
                }
              case 1:
                return <span>{record.cancel === 0 ? lang['duel.ended']:lang['duel.canceled']}</span>;
              default:
                return null;
            }
          }
        }
      ]
    }
  }
  componentWillMount() {
    this.getList();
  }
  activeClass(id1, id2, type) {
    return type !== 0 && id1 === id2 && id2  === type - 1 ? styles.self : '';
  }
  getList(load = true) {
    let {dispatch} = this.props;
    dispatch({
      type: 'duelInfo/getDuelInfo',
      payload: {load}
    })
  }
  battle(record) {
    const {langInfo: {lang}, tronInfo: {isTronLogin}, dispatch} = this.props;
    if(!isTronLogin) return message.warning(lang['duel.login']);

    this.setKey(record.id);

    const address = getUrlParam('from');
    joinDuel(record.id, record.bean, address).then(() => {
      this.getList(false);
      message.success(lang['duel.success']);
      this.setKey(-1);
      dispatch({
        type: 'capitalInfo/getCapitalInfo',
        payload: {load: false}
      })
    }).catch(() => {
      message.error(lang['duel.fail']);
      this.setKey(-1);
    })
  }
  cancel(record) {
    const {langInfo: {lang}, tronInfo: {isTronLogin}} = this.props;
    if(new Date(record.cancelAt).getTime() > Date.now()) 
      return message.error(`${lang['duel.after']}${record.cancelAt}${lang['duel.canbe']}`);
    if(!isTronLogin) return message.warning(lang['duel.login']);

    this.setKey(record.id);

    cancelDuel(record.id).then(() => {
      this.getList(false);
      message.success(lang['duel.cancel.success']);
      this.setKey(-1);
    }).catch(() => {
      this.getList(false);
      message.error(lang['duel.cancel.fail']);
      this.setKey(-1);
    })
  }
  setKey = (key) => {
    this.setState({currentKey: key});
  }
  callback(index) {
    const { dispatch } = this.props;
    dispatch({
      type: 'duelInfo/setDuelInfo',
      payload: {activeKey: index}
    })
    this.getList();
  }
  render() {
    let { columns } = this.state;
    let { loading, list } = this.props.duelInfo;
    const {langInfo: {lang}} = this.props;
    return (
      <PartContainer height="520px">
        <Tabs defaultActiveKey="1" size="large"
        tabBarGutter={10}
          onChange={index => this.callback(index)}>
          <TabPane tab={lang['duel.list']} key="1"></TabPane>
          <TabPane tab={lang['duel.my.list']} key="2"></TabPane>
        </Tabs>
        <Loading height="464px" loading={loading} data={list}>
          <Table 
            rowKey="id"
            columns={columns} 
            dataSource={list} 
            pagination={false} 
            scroll={{ y: 410 }}
          />
        </Loading>
      </PartContainer>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo,
    duelInfo: state.duelInfo
  }
})(DuelList);
