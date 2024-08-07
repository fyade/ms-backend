## 关于 About

这是一个后台管理系统模板，前端语言为Vue.js（Vue3），后端语言为Nest.js。

前端开源地址：
- https://github.com/fyade/ms-frontend-admin
- https://gitee.com/fyade/ms-frontend-admin

后端开源地址：
- https://github.com/fyade/ms-backend
- https://gitee.com/fyade/ms-backend

## 运行教程 How to run

环境要求：node、mysql、redis

1. 从仓库中拉取项目
```bash
git clone https://github.com/fyade/ms-backend.git
```

2. 配置

在 /config 目录下新建 config.ts 文件，然后将 config.txt 内的内容复制进去并根据自身情况做修改；

在 /config 目录下新建 authConfig.ts 文件，然后将 authConfig.txt 内的内容复制进去并根据自身情况做修改；

在根目录下新建 .env 文件，然后将以下内容复制进去，并根据自身情况做修改：
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mysql://root:123456@localhost:3306/table_name"

```

3. 初始化数据库

运行 `npx prisma migrate dev --name init` 命令

4. 运行

```bash
npm run start:dev
```

## 打包教程 How to build

注意：以生产环境为例子：在 config.ts 中有一个变量，叫 config ，其第一个键为 dev ，表示开发环境的配置，接下来你需要加一个键 prod ，表示生产环境的配置，然后你需要把 dev 的值复制进去并修改为生产环境的配置。

1. 将 /prisma/schema.prisma 中的 generator client.output （第9行）配置为 '../src/generated/client'

2. 运行 `npx prisma generate` 命令，然后将 /src/generated 目录复制至 生产环境根目录/src/generated

3. 运行 `npm run build` 命令，然后将 /dist/main.js 复制至 生产环境根目录

4. 运行 `$env:NODE_ENV="prod"; node .\main.js` 命令，其中 NODE_ENV 是命令行变量，在不同系统、不同命令行工具中写法不一样，请根据自身情况修改。

## 命令 Bin

启动命令：
```bash
$env:NODE_ENV="dev"; node ./main.js
```

其他命令：
```bash
npx prisma init
```

更新数据库：
```bash
$ npx prisma migrate dev --name init
```

生成 Prisma Client
```bash
$ npx prisma generate
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
