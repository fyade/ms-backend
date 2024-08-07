import axios, { AxiosRequestConfig } from 'axios';
import { currentEnv } from '../../config/config';

const axi = axios.create();

/**
 * 通用请求
 * @param config
 */
export async function request(config: AxiosRequestConfig) {
  const ret = await axi({
    baseURL: config.baseURL || (Object.keys(currentEnv()).includes('req') ? currentEnv().req.baseURL : ''),
    url: config.url,
    method: config.method || 'POST',
    params: config.params,
    data: config.data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Promise((resolve) => {
    resolve(ret.data);
  });
}

/**
 * 算法请求
 * @param config
 */
export async function requestSF(config: AxiosRequestConfig) {
  const ret = await axi({
    baseURL: config.baseURL || (Object.keys(currentEnv()).includes('sf') ? currentEnv().sf.baseURL : ''),
    url: config.url,
    method: config.method || 'POST',
    params: config.params,
    data: config.data,
    timeout: 1000 * 60 * 10,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Promise((resolve) => {
    resolve(ret.data);
  });
}
