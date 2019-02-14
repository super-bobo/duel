import tronInit from '../config/tronInit';
import tronConfig from '../config/tronConfig';
import { num2or6 } from '../utils/Tool';

let contractEvent = null;
let tokenContractEvent = null;

function contract() {
  if(contractEvent) return contractEvent;
  return tronInit(() => {
    contractEvent = contractEvent ? contractEvent : window.tronWeb.contract().at(tronConfig.contract);
    return contractEvent;
  })
}
function tokenContract() {
  if(tokenContractEvent) return tokenContractEvent;
  return tronInit(() => {
    tokenContractEvent = tokenContractEvent ? tokenContractEvent : window.tronWeb.contract().at(tronConfig.tokenContract);
    return tokenContractEvent;
  })
}


/**
 * @msg: 判断是否有地址，有则返回该地址，无则返回 ""
 * @param {type => 地址格式} 
 * @return: 
 */
export function getTronAddress(type = 'base58') {
  if(!window.tronWeb) return '';
  const defaultAddress = window.tronWeb.defaultAddress;
  const hasAddress = !Object.entries(defaultAddress)
    .map(([key, address]) => address).includes(false) // 判断是否有默认的地址
  return hasAddress ? window.tronWeb.defaultAddress[type] : "";
}




/**
 * @msg: 获取duel余额
 * @param {address： 用户地址} 
 * @return: 
 */
export function getDuelBalances() {
  return tokenContract().then(async contract => {
    return contract.balanceOf(await getTronAddress()).call().then(
      res => {
        return window.tronWeb.fromSun(window.tronWeb.toDecimal(res.balance._hex));
      }
    )
  })
}


/**
 * @msg: 创建决斗
 * @param {type} 
 * @return: 
 */
export function createDuel(type, callValue, address) {
    return contract().then(contract => {
      return contract.createDuel(type, tronConfig.cancelAt, address ? address : tronConfig.defaultAddress).send({
        // feeLimit: 10000,
        callValue: window.tronWeb.toSun(callValue),
        shouldPollResponse: true
      })
    })
}

/**
 * @msg: 加入决斗
 * @param
 * @return:
 */
export function joinDuel(duelId, callValue, address) {
  return contract().then(contract => {
      return contract.join(duelId, address ? address : tronConfig.defaultAddress).send({
          callValue: window.tronWeb.toSun(callValue),
          shouldPollResponse: true
      });
  })
}

/**
 * @msg: 取消决斗
 * @param
 * @return:
 */
export function cancelDuel(duelId) {
  return contract().then(contract => {
      return contract.cancel(duelId).send();
  })
}

/**
 * @msg: 获取所得的推广奖励
 * @param {address： 用户地址} 
 * @return: 
 */
export function getPromoterBalances() {
  return contract().then(contract => {
    return contract.promoterBalances(getTronAddress()).call().then(
      res => {
        return num2or6(window.tronWeb.fromSun(window.tronWeb.toDecimal(res._hex)))
      }
    )
  })
}


/**
 * @msg: 用户提现
 * @param {type} 
 * @return: 
 */
export function promoterWithdraw() {
  return contract().then(contract => {
    return contract.promoterWithdraw().send();
  })
}

/**
 * @description: 获取duel系数
 * @param {type} 
 * @return: 
 */
export function getDuelAward() {
  return contract().then(contract => {
    return contract.getDuelAward().call().then(
      res => {
        console.log(res, 'getDuelAward');
        return res/100;
      }
    )
  })
}


/**
 * @description: 获取平台维护费
 * @param {type} 
 * @return: 
 */
export function getMaintenanceChargeRate() {
  return contract().then(contract => {
    return contract.maintenanceChargeRate().call().then(
      res => {
        return res;
      }
    )
  })
}

/**
 * @description: 获取平台手续费
 * @param {type} 
 * @return: 
 */
export function getServiceChargeRate() {
  return contract().then(contract => {
    return contract.serviceChargeRate().call().then(
      res => {
        return res/100
      }
    )
  })
}



