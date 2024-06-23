import { SECRET_KEY } from '../config/authConfig';

const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

/**
 * 单向加密
 * @param password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const newPsd = await bcrypt.hash(password, salt);
  return newPsd;
}

/**
 * 单向加密的校验
 * @param password
 * @param hashedPassword
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const boole = await bcrypt.compare(password, hashedPassword);
  return boole;
}

/**
 * 双向加密的解密
 * @param encryptedStr
 */
export function decrypt(encryptedStr: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedStr, SECRET_KEY);
  const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
  return originalPassword;
}
