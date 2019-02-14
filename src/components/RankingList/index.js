import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import styles from './style.scss';

import { Tabs, Table, Icon } from 'antd';
import PartContainer from '../PartContainer';
import Loading from '../Loading';

import { rankingList } from '../../api';

const TabPane = Tabs.TabPane;


class List extends Component {
  constructor(props) {
    super(props);
    const {lang} = this.props.langInfo;
    this.state = {
      list: [],
      activeKey: '1',
      loading: false,
      time: '',
      columns: [
        {
          title: lang['ranking.ranking'],
          dataIndex: 'creator',
          width: '20%',
          align: 'center',
          render: (text, record) => {
            switch (record.key) {
              case 1:
                return (<img src={require('../../assets/images/num-one-icon.png')} />);
              case 2:
                return (<img src={require('../../assets/images/num-two-icon.png')} />);
              case 3:
                return (<img src={require('../../assets/images/num-three-icon.png')} />);
              default:
                return (<span className={`${this.activeClass(record.type)} ${styles.rank}`}>{record.key}</span>);
            }
          }
        },{
          title: lang['ranking.player'],
          dataIndex: 'address',
          width: '50%',
          align: 'center',
          render: (text, record) => {
            return (
              <div className={this.activeClass(record.type)}>{record.address}</div>
            )
          }
        },{
          title: lang['ranking.total.balance'],
          dataIndex: 'name',
          width: '30%',
          align: 'center',
          render: (text, record) => {
            return <div className={this.activeClass(record.type)}>{record.incomeTotal}TRX</div>
          }
        }
      ]
    }
  }
  componentWillMount() {
    let time = moment().format('YYYY-MM-DD');
    this.setState({time}, ()=>{
      this.getList();
    })
  }
  activeClass(type) {
    return type !== 0 ? styles.self : '';
  }
  getList() {
    let { activeKey, time } = this.state;
    this.setState({loading: true});
    let currentTime = time;
    if(activeKey === '1') currentTime = '';
    rankingList({time: currentTime}).then(res => {
      this.setState({
        list: res.data.body,
        loading: false
      })
    })
  }
  callback(index) {
    this.setState({activeKey: index}, () => {
      this.getList();
    });
  }
  changeTime(type) {
    let { time } = this.state;
    let currentTime = moment().format('YYYY-MM-DD');
    if(type === 'add') {
      let notNext = new Date(moment().format('YYYY-MM-DD')).getTime() <= new Date(time).getTime();
      if(notNext) return false;
      currentTime= moment(new Date(time)).add(1, 'd').format('YYYY-MM-DD');
    } else if(type === 'reduce') {
      currentTime = moment(new Date(time)).subtract(1, 'd').format('YYYY-MM-DD');
    }
    this.setState({time: currentTime}, () => {
      this.getList();
    });
  }
  render() {
    let { loading, columns, list, activeKey, time } = this.state;
    const {lang} = this.props.langInfo;
    list = list.map((item, index) => {
      return {
        ...item,
        key: index + 1
      }
    });
    let notNext = new Date(moment().format('YYYY-MM-DD')).getTime() <= new Date(time).getTime();
    return (
      <PartContainer height="520px">
        <Tabs defaultActiveKey="1" size="large"
          tabBarGutter={10}
          onChange={index => this.callback(index)}>
          <TabPane tab={lang['ranking.total.list']} key="1"></TabPane>
          <TabPane tab={lang['ranking.day.list']} key="2"></TabPane>
        </Tabs>
        {activeKey === '2' && 
          <div className={styles['time-wrap']}>
            <span onClick={() => this.changeTime('reduce')}><Icon type="left-circle" /></span>
            <time>{time}</time>
            <span className={notNext ? styles.disabled: null} onClick={() => this.changeTime('add')}><Icon type="right-circle" /></span>
          </div>}
        <Loading height="464px" loading={loading} data={list}>
          <Table
            columns={columns} 
            dataSource={list} 
            pagination={false} 
            scroll={{ y: 410 }}
            loading={loading}
          />
        </Loading>
      </PartContainer>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(List);
