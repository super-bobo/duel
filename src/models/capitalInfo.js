import { amountRecordsList } from '../api';

export default {

  namespace: 'capitalInfo',

  state: {
    list: [],
    loading: false,
    page: 1,
    limit: 30,
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  reducers: {
    setCapitalInfo(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *getCapitalInfo({ payload }, { call, put, select }) {
      const { capitalInfo: {page, limit}} = yield select((state)=>state);
      let { load } = payload;
      if(load) yield put({ type: 'setCapitalInfo', payload: {loading: load} });
      let result = yield call(amountRecordsList, {page, limit});
      yield put({ type: 'setCapitalInfo', payload: {list: result.data.body, loading: false} });
    }
  },

};
