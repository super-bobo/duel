import zh from './zh';
import en from './en';
const MESSAGES = { en, zh };
const LANG = window.localStorage.getItem('lang') || 'zh';

export default MESSAGES[LANG]; 