import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import { Table } from 'antd';
import PartContainer from '../PartContainer';
import Loading from '../Loading';
import Refresh from '../Refresh';

class CapitalList extends Component {
  constructor(props) {
    super(props);
    const {lang} = this.props.langInfo;
    this.state = {
      columns: [
        {
          title: lang['capital.type'],
          dataIndex: 'type',
          width: '28%',
          align: 'center',
          render: (text, record) => {
            let { type } = this.state;
            return <div>{type[record.type]}</div>
          }
        },{
          title: lang['capital.time'],
          dataIndex: 'createdAt',
          width: '48%',
          align: 'center'
        },{
          title: lang['capital.balance'],
          dataIndex: 'amount',
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
    this.getList(true);
  }
  activeClass(type) {
    return type !== 0 ? styles.self : '';
  }
  getList(load = false) {
    const {dispatch} = this.props;
    dispatch({
      type: 'capitalInfo/getCapitalInfo',
      payload: {load}
    })
  }
  render() {
    let { columns } = this.state;
    let { loading, list } = this.props.capitalInfo;
    const {lang} = this.props.langInfo;
    return (
      <PartContainer height="520px">
        <p className={styles.title}>{lang['capital.detail']}</p>
        <Refresh onClick={()=> this.getList(true)} />
        <Loading height="464px" loading={loading} data={list}>
          <Table
            rowKey="id"
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
    tronInfo: state.tronInfo,
    capitalInfo: state.capitalInfo
  }
})(CapitalList);
