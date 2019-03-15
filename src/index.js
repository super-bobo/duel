import './assets/css/common.scss';
import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import { tronInfo, lang, duelInfo, capitalInfo } from './models';

import FullComponent from './FullComponent';

FullComponent.init('full-load', 'fullLoading');

window.prod = process.env.REACT_APP_SECRET_CODE === 'prod' // prod 正式环境

// 1. Initialize
const app = dva({
    history: createHistory()
});

// 2. Plugins
app.use({});

// 3. Model
app.model(lang);
app.model(tronInfo);
app.model(duelInfo);
app.model(capitalInfo);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');