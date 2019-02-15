import React, { Component } from 'react';
import { connect } from 'dva';

import { getUrlParam, deepCopy } from '../../utils/Tool';

import styles from './style.scss';

import { Tabs, Table, Row, Col, message, Icon, Progress } from 'antd';
import PartContainer from '../PartContainer';
import Loading from '../Loading';
import Btn from '../Btn';

import { joinDuel, cancelDuel } from '../../api/tronApi';
import { duelDetail } from '../../api';

const TabPane = Tabs.TabPane;

class DuelList extends Component {
  constructor(props) {
    super(props);
    const {langInfo: {lang}} = this.props;
    this.state = {
      currentKey: -1,
      activeDuel: [], // 进行中的duel
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
            let { currentKey, activeDuel } = this.state;
            let index = this.findIndex(activeDuel, record.id);
            let currnet = index !== -1 ? activeDuel[index] : null;
            switch (record.finished) {
              case 0:
                if(record.type === 1) {
                  return <Btn type="cancel" onClick={() => this.cancel(record)} loading={currentKey === record.id}>{lang['duel.cancel']}</Btn>;
                } else {
                  return currnet ? (
                    currnet.loading ? (
                      <Btn type="duel" onClick={() => this.battle(record)} loading={currnet.loading}>{lang['duel.duel']}</Btn>
                    ) : (
                      <div><Progress type="circle" status="success" width={36} strokeWidth={10} percent={currnet.count*10} format={() => Math.ceil(currnet.count)} /></div>
                    )
                  ) : (
                    <Btn type="duel" onClick={() => this.battle(record)}>{lang['duel.duel']}</Btn>
                  );
                }
              case 1:
                return record.cancel === 0 ? (
                  currnet ? (
                    currnet.data.creatorOption !== currnet.data.resultOption ? 
                    <Icon className={styles.icon} type="smile" theme="twoTone" twoToneColor="#52c41a" /> : 
                    <Icon className={styles.icon} type="frown" theme="twoTone" twoToneColor="#999" />
                  ) :
                  <span>{record.cancel === 0 ? lang['duel.ended']:lang['duel.canceled']}</span>
                ) : (
                  <span>{lang['duel.canceled']}</span>
                )
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
    if(type === 1 && id1 === id2 || type === 2 && id1 !== id2) return styles.self;
    else return '';
  }
  getList(load = true) {
    let {dispatch} = this.props;
    dispatch({
      type: 'duelInfo/getDuelInfo',
      payload: {load}
    })
  }
  findIndex(arr, id){
    return arr.findIndex(item => {
      return item.id === id;
    })
  }
  getDuelDetial(id){
    return new Promise((resolve, reject) => {
      let count = 0;
      let fun = (id) => {
        duelDetail(id).then(res => {
          count++;
          if(res.data.body.finished === 1) resolve(res.data.body);
          else {
            setTimeout(() => {
              fun()
            }, 100);
          }
        });
      }
      fun(id);
    })
  }
  battle(record) {
    let { activeDuel } = this.state;
    const {langInfo: {lang}, tronInfo: {isTronLogin}, dispatch} = this.props;
    let { list } = this.props.duelInfo;
    if(!isTronLogin) return message.warning(lang['duel.login']);

    this.setKey(record.id);
    activeDuel.push({
      id: record.id,
      loading: true,
      count: 10,
      data: {}
    });
    let index  = this.findIndex(activeDuel, record.id);
    this.setActiveDuel(activeDuel);
    const address = getUrlParam('from');
    joinDuel(record.id, record.bean, address).then(async () => {
      message.success(lang['duel.success']);
      activeDuel[index].loading = false;
      this.setActiveDuel(activeDuel);
      let detail = await this.getDuelDetial(record.id);
      activeDuel[index].data = detail;
      this.setActiveDuel(activeDuel);
      let time = 10;
      let interval = setInterval(() => {
        time = time - 0.1;
        activeDuel[index].count = time;
        this.setActiveDuel(activeDuel);
        if(time <= 0) {
          clearInterval(interval);
          let listIndex  = this.findIndex(list, record.id);
          list[listIndex] = detail;
          dispatch({
            type: 'duelInfo/setDuelInfo',
            payload: {list}
          })
          dispatch({
            type: 'capitalInfo/getCapitalInfo',
            payload: {load: false}
          })
        }
      }, 100);
    }).catch(() => {
      message.error(lang['duel.fail']);
      activeDuel.splice(index, 1);
      this.setActiveDuel(activeDuel);
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
  setActiveDuel = activeDuel => {
    this.setState({activeDuel});
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
        <div className={styles['loading-wrap']} onClick={()=> this.getList()}>
          <Icon type="reload" />
        </div>
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
