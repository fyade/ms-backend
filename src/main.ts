import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { currentEnv } from './config/config';
import { time } from './util/TimeUtils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    req['TIMEZONE'] = 'Asia/Shanghai'; // 设置全局时区
    next();
  });
  const node_env = currentEnv();
  await app.listen(node_env.port);
  console.log(`${time()} ${node_env.mode} ${node_env.port}`);
}

bootstrap();
