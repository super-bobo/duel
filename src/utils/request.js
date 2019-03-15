import fetch from 'dva/fetch';
import { getTronAddress } from '../api/tronApi';
import CurrentLang from '../locales/CurrentLang';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

/**
 * @description: get method 
 * @param {type} 
 * @return: 
 */
export function getData(url, data = {}, options = {}) {
  if(options.lang) data.language = CurrentLang;
  if(options.address) data.address = getTronAddress();
  if(options.t) data.t = Date.now();
  let dataStr = Object.entries(data).map(([key, value]) => `${key}=${value}`);
  dataStr = dataStr.join('&');
  url = `${url}?${dataStr}`;
  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json' // 通过头指定，获取的数据类型是JSON
    }), 
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

export function postData(url, data = {}, options = {}) {
  if(options.lang) data.language = CurrentLang;
  if(options.address) data.address = getTronAddress();
  return fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json', // 通过头指定，获取的数据类型是JSON
      'Content-Type': 'application/json'
    }),
    ...options
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}
