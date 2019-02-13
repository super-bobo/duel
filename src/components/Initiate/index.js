import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import config from './config';

import { Slider, InputNumber, Row, Col, message } from 'antd';
import { isNumber } from 'util';

import { getUrlParam } from '../../utils/Tool';

import { createDuel } from '../../api/tronApi';

import PartContainer from '../PartContainer';

import Btn from '../Btn';


class Header extends Component {
  constructor(props) {
    super(props);
    const { min } = config;
    this.state = {
      inputValue: min,
      currentType: 0,
      creating: false
    }
  }
  chooseBtn(index) {
    this.setState({
      currentType: index
    })
  }
  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
  }
  onBlur = () => {
    if(this.state.inputValue) return false;
    const { min } = config;
    return this.setState({
      inputValue: min
    })
  }
  onSubmit() { // 提交决斗
    const { inputValue, currentType } = this.state;
    const {min, max} = config;
    let { tronInfo: {tronBalance}, langInfo: {lang} } = this.props;
    tip.call(this, true);
    function tip(bol = false) {
      this.setState({
        creating: bol
      })
    }
    if (tronBalance < inputValue) {
      message.warn(lang['initiate.not.enough']);
      return tip.call(this);
    }
    if (min > inputValue) {
      message.warn(`${lang['initiate.at.lest']}${min}`);
      return tip.call(this);
    }
    if (max < inputValue) {
      message.warn(`${lang['initiate.at.most']}${max}`);
      return tip.call(this);
    }
    // 创建决斗
    const address = getUrlParam('from');
    createDuel(currentType, inputValue, address).then(() => {
      tip.call(this);
      message.success(lang['initiate.create.success']);
    }).catch(() => {
      tip.call(this);
      message.error(lang['initiate.create.fail']);
    })
  }
  componentWillMount() {
  }
  render() {
    const { inputValue, currentType, creating } = this.state;
    const {min, max, odds} = config;
    let { isTronLogin, tronBalance, duelBalance } = this.props.tronInfo;
    const {lang} = this.props.langInfo;
    let obtain = isNumber(inputValue) ? (inputValue*2*(1 - odds)).toFixed(1) : '0.0';
    return (
      <PartContainer height="520px">
        <div className={styles['content']}>
          <div className={styles.top}>
            <img src={require(`../../assets/images/${currentType === 0 ? 'g' : 's'}_box.png`)} />
            <div className={styles['btn-group']}>
              <span className={`${styles.btn} ${styles.jinse} ${currentType === 0 ? styles.active: ''}`} 
                onClick={() => this.chooseBtn(0)}>{lang['initiate.gold.box']}</span>
              <span className={`${styles.btn} ${styles.yinse} ${currentType === 1 ? styles.active: ''}`} 
                onClick={() => this.chooseBtn(1)}>{lang['initiate.silver.box']}</span>
            </div>
          </div>
          <div className={styles['duel-wrapper']}>
            <Row type="flex" align="middle" className={styles.center}>
              <Col style={{marginRight: '15px'}}>
                <span>{lang['initiate.bets.number']}</span>
              </Col>
              <Col style={{flex: 1}}>
                <Slider
                  tooltipVisible
                  min={min}
                  max={max}
                  onChange={this.onChange}
                  value={typeof inputValue === 'number' ? inputValue : min}
                />
              </Col>
              <Col>
                <InputNumber
                  min={min}
                  max={max}
                  style={{marginLeft: '15px',marginRight: '2px'}}
                  value={inputValue}
                  onChange={this.onChange}
                  onBlur={this.onBlur}
                /> TRX
              </Col>
            </Row>
          </div>
          <div className={styles.result}>
            <Row>
              <Col span={12}>
                {lang['initiate.wallet.balance']}
                <div className={styles.num}>{tronBalance}<small>TRX</small></div>
              </Col>
              <Col span={12}>
                {lang['initiate.guess.trx']}
                <div className={styles.num}>{obtain}<small>TRX</small></div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {lang['initiate.duel.balance']}
                <div className={styles.num}>{duelBalance}<small>duel</small></div>
              </Col>
              <Col span={12}>
                {lang['initiate.guess.duel']}
                <div className={styles.num}>{obtain}<small>duel</small></div>
              </Col>
            </Row>
          </div>
          <div className={styles.submit}>
            {isTronLogin ? (
              <Btn onClick={() => this.onSubmit()} loading={creating}>{lang['initiate.create.durl']}</Btn>
            ) : (
              <Btn type="cancel">{lang['initiate.login']}</Btn>
            )}
          </div>
        </div>
      </PartContainer>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(Header);
