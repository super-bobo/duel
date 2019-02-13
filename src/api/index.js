import { getData, postData } from '../utils/request';
import tronInit from '../config/tronInit';
import tronConfig from '../config/tronConfig';
import { getTronAddress } from './tronApi';

const apiUrl = '/api';

let hasInit = false;
function getAsyncData(fn) {
  if(hasInit) return fn();
  return tronInit(() => {
    if(getTronAddress()) hasInit = true;
    return fn();
  })
}

// 获取用户信息
export const getTronAccount = () => postData(`${tronConfig.TRONGRID_API}/wallet/getaccount`, { address: getTronAddress('hex') });

// 获取全部决斗列表
export const duelsList = params => getAsyncData(() => getData(`${apiUrl}/duels`, params, {address: true}))
// 获取我的决斗列表
export const myDuelsList = params => getAsyncData(() => getData(`${apiUrl}/myDuels`, { ...params}, {address: true}))
// 获取推广列表
export const promoterRecordsList = params => getAsyncData(() => getData(`${apiUrl}/promoterRecords`, params, {address: true}))
// 获取排行榜列表
export const rankingList = params => getAsyncData(() => getData(`${apiUrl}/rankingList`, { ...params, contract: tronConfig.contract}, {address: true}))
// 获取资金列表
export const amountRecordsList = params => getAsyncData(() => getData(`${apiUrl}/amountRecords`, params, {address: true}))