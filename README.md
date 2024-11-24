## 关于 About

这是一个后台管理系统模板，前端语言为Vue.js（Vue3），后端语言为Nest.js，建议Node版本：20.12.0。

版本建议：
- Node 20.12.0
- MySQL 8
- Redis 较新版本皆可

前端开源地址：
- https://github.com/fyade/ms-frontend-admin
- https://gitee.com/fyade/ms-frontend-admin

后端开源地址：
- https://github.com/fyade/ms-backend
- https://gitee.com/fyade/ms-backend

## 运行教程 How to run

若非初次运行，可直接 `npm run start:dev` 运行，然后下面步骤可忽略。

1. 从仓库中拉取项目
```bash
git clone https://github.com/fyade/ms-backend.git
```

2. 配置

在 /config 目录下新建 config.ts 文件，然后将 config.txt 内的内容复制进去并根据自身情况做修改；

在根目录下新建 .env 文件，然后将以下内容复制进去，并根据自身情况做修改：
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="mysql://root:123456@localhost:3306/table_name"

```

3. 初始化数据库

运行 `npx prisma migrate dev --name init` 命令；

4. 接下来

若未全局安装 nest ，则先需要全局安装 nest ，命令为 `npm i -g @nestjs/cli`；

其次下载项目依赖，命令为 `npm i`；

然后还需要向部分表中插入初始数据，初始数据位于 /bin/sql.sql；

随后需要插入一个初始用户，步骤如下：

4.1 打开 api 工具如 postman，调用 /sys/user/regist 接口，请求方法为 POST ，请求体参数如下，其中username和password改成管理员的用户名和密码、psdType勿更改；

```json
{
  "username": "username",
  "password": "password",
  "psdType": "a"
}
```

4.2 随后发送请求，请求成功后，打开数据库管理软件，打开 sys_user 表，复制刚注册的用户的 id 字段；

4.3 打开 sys_admin_top 表，添加一条记录，其中 user_id 为刚复制的 id ， deleted 为 'N'，其他随意；

4.4 `npm run start:dev` 运行；

## 打包教程 How to build

注意：以生产环境为例子：在 config.ts 中有一个变量，叫 config ，其第一个键为 dev ，表示开发环境的配置，接下来你需要加一个键 prod ，表示生产环境的配置，然后你需要把 dev 的值复制进去并修改为生产环境的配置。

1. 将 /prisma/schema/schema.prisma 中的 generator client.output （第9行）配置为 '../../generated/client'；

2. 运行 `npx prisma generate` 命令，然后将 /generated 目录复制至 生产环境根目录/generated；

3. 运行 `npm run build` 命令，然后将 /dist/main.js 复制至 生产环境根目录；

4. 运行 `$env:NODE_ENV="prod"; node .\main.js` 命令，其中 NODE_ENV 是命令行变量，在不同系统、不同命令行工具中写法可能不一样，请根据自身情况修改。

## 修改数据库结构 How to edit database

1. 在 /prisma/schema/schema.prisma 中定义数据库；

2. 在 .env 中定义数据库地址，随后运行 `npx prisma migrate dev --name gx` 命令。

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

重置数据库：
```bash
$ npx prisma migrate reset
```

生成 Prisma Client：
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

## 注意 NOTICE

菜单相关常量：
* mm表示菜单
* mc表示组件
* ma表示接口组
* mb表示接口

菜单ip限制相关常量：
* ip表示ip
* ho表示host

## 许可证 License

[GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.txt)

License file name in this project: COPYING

Copyright (c) 2024-present, Fei Yang
