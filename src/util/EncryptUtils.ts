const bcrypt = require('bcryptjs');

/**
 * 加密
 * @param password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const newPsd = await bcrypt.hash(password, salt);
  return newPsd;
}

/**
 * 校验
 * @param password
 * @param hashedPassword
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const boole = await bcrypt.compare(password, hashedPassword);
  return boole;
}
