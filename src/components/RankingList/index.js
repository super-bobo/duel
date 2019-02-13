import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Tabs, Table } from 'antd';
import PartContainer from '../PartContainer';
import OverContainer from '../OverContainer';
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
                return (<span className={this.activeClass(record.type)}>{record.key}</span>);
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
    this.getList();
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
  render() {
    let { loading, columns, list } = this.state;
    const {lang} = this.props.langInfo;
    list = list.map((item, index) => {
      return {
        ...item,
        key: index + 1
      }
    })
    return (
      <PartContainer height="520px">
        <Tabs defaultActiveKey="1" size="large"
        tabBarGutter={10}
          onChange={index => this.callback(index)}>
          <TabPane tab={lang['ranking.total.list']} key="1"></TabPane>
          <TabPane tab={lang['ranking.day.list"']} key="2"></TabPane>
        </Tabs>
        <OverContainer height="464px">
          <Loading loading={loading} data={list}>
            <Table
              columns={columns} 
              dataSource={list} 
              pagination={false} 
              scroll={{ y: 410 }}
              loading={loading}
            />
          </Loading>
        </OverContainer>
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
