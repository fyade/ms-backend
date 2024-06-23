## 使用说明 Description

在 /config 目录下新建 config.ts 文件，并写入以下内容：
```typescript
import * as process from "process";
import { base } from "src/util/base";

export const currentEnv = () => {
  const env = process.env.NODE_ENV || base.DEV
  return config[env]
}

const publicConfig = {
}
const config = {
  dev: {
    ...publicConfig,
    mode: base.DEV,
    port: '', // 这里改成您的端口
    database: {
      url: ``, // 这里改成您的数据库地址，格式（以mysql为例）：mysql://用户名:密码@数据库ip:数据库端口/表名
    },
    file: {
      fileUploadPath: '', // 这里改成您的文件保存地址，使用绝对路径
      fileChunkPath: '', // 这里改成您的文件碎片保存地址，使用绝对路径
      maxSizeOfFull: 1024 * 1024 * 10
    },
    log: {
      logSavePath: ''  // 这里改成您的日志文件保存地址，使用绝对路径
    }
  },
  prod: {
    ... // 与上面的dev配置项一样
  }
}
```
在 /config 目录下新建 authConfig.ts 文件，并写入以下内容：
```typescript
export const jwtConstants = {
  secret: '', // 这里输入你的盐
};
export const SECRET_KEY = '' // 这里输入你的盐
export const expireTime = '3600s'; // 这里是token超时时间
export const reqWhiteList = ['/sys/user/regist', '/sys/user/login'];
export const adminLoginUrl = '/sys/user/adminlogin';
```

## 命令 Bin

启动命令：
```bash
$env:NODE_ENV="prod"; node ./main.js
```

其他命令：
```bash
npx prisma init
```

```bash
$ npx prisma migrate dev --name init # 数据库
```

```bash
$ prisma generate # 生成 Prisma Client
```

```bash
$ nest generate interceptor auth-token # 生成拦截器
```

```bash
$ nest g mo module/name # 创建一个用户模块
$ nest g co module/name --no-spec # 创建不带测试文件的控制器
$ nest g s module/name --no-spec # 创建不带测试文件的服务层
```

```bash
$ nest g pipe validation pipe # 管道
```

## 许可证 License

[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.txt)

License file name in this project: COPYING

Copyright (c) 2024-present, Fei Yang
