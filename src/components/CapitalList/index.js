import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Table } from 'antd';
import PartContainer from '../PartContainer';
import OverContainer from '../OverContainer';
import Loading from '../Loading';

import { amountRecordsList } from '../../api';


class CapitalList extends Component {
  constructor(props) {
    super(props);
    const {lang} = this.props.langInfo;
    this.state = {
      list: [],
      loading: false,
      page: 1, 
      limit: 30,
      columns: [
        {
          title: lang['capital.type'],
          dataIndex: 'type',
          width: '25%',
          align: 'center',
          render: (text, record) => {
            let { type } = this.state;
            return <div>{type[record.type]}</div>
          }
        },{
          title: lang['capital.time'],
          dataIndex: 'createdAt',
          width: '50%',
          align: 'center'
        },{
          title: lang['capital.balance'],
          dataIndex: 'amount',
          width: '25%',
          align: 'center',
          render: (text, record) => {
            let add = record.type === 2 || record.type === 3 || record.type === 4;
            return <div className={add ? styles.add : styles.reduce}>{add ? '+' : '-'}{record.amount}TRX</div>
          }
        }
      ],
      type: {
        // 类型 0.创建决斗,1.加入决斗,2.取消决斗,3.胜利自动转账，4推广提现
        0: lang['capital.create.duel'],
        1: lang['capital.add.duel'],
        2: lang['capital.cancel.duel'],
        3: lang['capital.victory.autopay'],
        4: lang['capital.promotion.withdrawal']
      }
    }
  }
  componentWillMount() {
    this.getList();
  }
  activeClass(type) {
    return type !== 0 ? styles.self : '';
  }
  getList() {
    let { page, limit } = this.state;
    this.setState({loading: true});
    amountRecordsList({page, limit}).then(res => {
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
    return (
      <PartContainer height="520px">
        <p className={styles.title}>{lang['capital.detail']}</p>
        <OverContainer height="464px">
          <Loading loading={loading} data={list}>
            <Table
              rowKey="id"
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
})(CapitalList);
