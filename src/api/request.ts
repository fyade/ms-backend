import axios, { AxiosRequestConfig } from 'axios';
import { currentEnv } from '../../config/config';

const axi = axios.create({
  baseURL: currentEnv().req.baseUrl,
  timeout: 1000 * 60 * 10,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function request(config: AxiosRequestConfig) {
  const ret = await axi({
    baseURL: config.baseURL || currentEnv().req.baseUrl,
    url: config.url,
    method: config.method || 'POST',
    params: config.params,
    data: config.data,
  });
  return new Promise((resolve) => {
    resolve(ret.data);
  });
}
