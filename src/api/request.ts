import axios from 'axios';
import { currentEnv } from '../../config/config';

const axi = axios.create({
  baseURL: currentEnv().sf.baseUrl,
  timeout: 1000 * 60 * 10,
});

export async function request(url: string, data: any) {
  const ret = await axi({
    url: url,
    method: 'POST',
    data: data,
  });
  return new Promise((resolve, reject) => {
    resolve(ret.data.data);
  });
}
