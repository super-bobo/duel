import zh from '../locales/zh';
import en from '../locales/en';
import CurrentLang from '../locales/CurrentLang';
const MESSAGES = { en, zh };

export default {

  namespace: 'lang',

  state: {
    currentLang: '',
    lang: Object
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: 'setLang',
        payload: CurrentLang
      })
    }
  },

  reducers: {
    setLang(state, action) {
      return { 
        currentLang: action.payload,
        lang: MESSAGES[action.payload]
      };
    }
  }

};
