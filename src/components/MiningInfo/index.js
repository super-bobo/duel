import React, { Component } from 'react';
import { connect } from 'dva';

import styles from './style.scss';

import configBet from './configBet';


class MiningInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentWillMount() {
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default connect(state => {
  return {
    langInfo: state.lang,
    tronInfo: state.tronInfo
  }
})(MiningInfo);
