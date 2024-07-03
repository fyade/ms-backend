## 关于 About

这是一个后台管理系统模板，前端语言为Vue.js（Vue3），后端语言为Nest.js。

前端开源地址：
https://github.com/fyade/ms-frontend-admin
https://gitee.com/fyade/ms-frontend-admin
后端开源地址：
https://github.com/fyade/ms-backend
https://gitee.com/fyade/ms-backend

## 使用说明 Description

在 /config 目录下新建 config.ts 文件，随后将 config.txt 内的内容复制进去并根据自身情况做修改；
在 /config 目录下新建 authConfig.ts 文件，随后将 authConfig.txt 内的内容复制进去并根据自身情况做修改；

## 命令 Bin

启动命令：
```bash
$env:NODE_ENV="dev"; node ./main.js
```

其他命令：
```bash
npx prisma init
```

```bash
$ npx prisma migrate dev --name init # 数据库
```

```bash
$ npx prisma generate # 生成 Prisma Client
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
