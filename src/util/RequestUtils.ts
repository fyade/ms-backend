import * as uaparser from 'ua-parser-js';
import { Request } from 'express';

/**
 * 从请求中读取ip信息
 * @param request
 */
export function getIpInfoFromRequest(request: Request) {
  const loginIp = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || (request as any).ip;
  const userAgentString = request.headers['user-agent'];
  const userAgent = uaparser(userAgentString);
  const browser = userAgent.browser;
  const os = userAgent.os;
  const loginBrowser = `${browser.name} ${browser.version}`;
  const loginOs = `${os.name} ${os.version}`;
  return {
    ip: loginIp,
    browser: loginBrowser,
    os: loginOs,
  };
}
