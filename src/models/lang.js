import zh from '../locales/zh';
import en from '../locales/en';
const MESSAGES = { en, zh };

export default {

  namespace: 'lang',

  state: {
    currentLang: '',
    lang: Object
  },

  subscriptions: {
    setup({ dispatch, history }) {
      const lang = window.localStorage.getItem('lang') || 'zh';
      dispatch({
        type: 'setLang',
        payload: lang
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
