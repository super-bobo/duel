import tronInit from '../config/tronInit';
import { getTronAddress, getDuelBalances, getDuelAward } from '../api/tronApi';
import { getTronAccount } from '../api';

import FullComponent from '../FullComponent';

let asyncLoaded = true;
export default {

  namespace: 'tronInfo',

  state: {
    isTronLogin: false, // 钱包是否登录
    tronAddress: '', // 钱包地址
    tronBalance: 0, // trx余额
    duelBalance: 0, // duel 余额
    userBalance: 0, // 可提现余额
    duelAward: 1 // duel奖励系数
  },

  subscriptions: {
    setup({ dispatch, history }) {
      tronInit(() => {
        dispatch({
          type: 'getTronInfo'
        });
        dispatch({
          type: 'duelAward'
        });
        setInterval(() => {
          dispatch({
            type: 'getTronInfo'
          });
        }, 5000);
      });
    },
  },

  reducers: {
    setTroninfo(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *getTronInfo({ payload }, { call, put, all }) {
      let tronAddress = yield call(getTronAddress);
      yield put({ type: 'setTroninfo', payload: {isTronLogin: !!tronAddress, tronAddress} });
      if(!!tronAddress){
        let [tronAccount, duelBalance] = yield all([call(getTronAccount), call(getDuelBalances)]);
        let { balance } = tronAccount.data;
        let tronBalance = balance ? window.tronWeb.fromSun(balance) : 0;
        yield put({ type: 'setTroninfo', payload: { tronBalance, duelBalance } });
      }
      asyncLoaded && FullComponent.remove('full-load'); // 移除loading效果
      asyncLoaded = false;
    },
    *duelAward({ payload }, { call, put, all }) {
      let duelAward = yield call(getDuelAward);
      yield put({ type: 'setTroninfo', payload: {duelAward} });
    }
  },

};
