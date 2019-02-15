import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';
import {getAwardDuelTotal} from '../../api/tronApi';
import moment from 'moment';
import miningData from './miningData';


class MiningInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currnetTime:'',
      awardDuelTotal: 0
    }
  }
  componentWillMount() {
    this.getData();
    setInterval(this.getData.bind(this), 1000*60);
  }
  getData() {
    this.setState({currnetTime: moment().format('HH:mm:ss')});
    getAwardDuelTotal().then(awardDuelTotal => {
      this.setState({awardDuelTotal});
    })
  }
  render() {
    let { currnetTime, awardDuelTotal } = this.state;
    let { duelAward } = this.props.tronInfo;
    const { lang } = this.props.langInfo;
    let currentItem = miningData.filter(item => item.key === duelAward);
    let currentRound = (awardDuelTotal%currentItem[0].val).toLocaleString();
    let currentRate = (awardDuelTotal/currentItem[0].val*100).toFixed(3);
    let totalRound = (awardDuelTotal).toLocaleString();
    let totalRate = (awardDuelTotal/currentItem[0].val/10*100).toFixed(3);
    return (
      <div className={styles.mining}>
        <span className={styles.list}>
          <time>{currnetTime}(UTC+8)</time>
        </span>
        <span className={styles.list}>
          {lang['mining.dig.phase']}{lang['mining.di']}{currentItem[0].mining}{lang['mining.lun']}
        </span>
        <span className={styles.list}>
          {lang['mining.efficiency']}<span className={styles.high}>1 TRX : {duelAward} Duel</span>
        </span>
        <span className={styles.list}>
          {lang['mining.this.state']}<span className={styles.high}>{currentRound}</span>（{currentRate}%）
        </span>
        <span className={styles.list}>
          {lang['mining.total.state']}<span className={styles.high}>{totalRound}</span>（{totalRate}%）
        </span>
      </div>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(MiningInfo);
