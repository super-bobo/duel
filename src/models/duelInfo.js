import { duelsList, myDuelsList } from '../api';

export default {

  namespace: 'duelInfo',

  state: {
    list: [],
    loading: false,
    page: 1,
    limit: 50,
    activeKey: '1'
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  reducers: {
    setDuelInfo(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *getDuelInfo({ payload }, { call, put, select }) {
      const { duelInfo: {page, limit, activeKey}} = yield select((state)=>state);
      let { load } = payload;
      if(load) yield put({ type: 'setDuelInfo', payload: {loading: load} });
      if(activeKey === '1') {
        let result = yield call(duelsList);
        yield put({ type: 'setDuelInfo', payload: {list: result.data.body, loading: false} });
      } else if(activeKey === '2'){
        let result = yield call(myDuelsList, {page, limit});
        yield put({ type: 'setDuelInfo', payload: {list: result.data.body, loading: false} });
      }
    }
  },

};
