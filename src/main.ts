import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { currentEnv } from '../config/config';
import { time } from './util/TimeUtils';
import { base } from './util/base';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const banner = 'This is a banner.';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    req['TIMEZONE'] = 'Asia/Shanghai'; // 设置全局时区
    next();
  });
  const node_env = currentEnv();
  if ([base.DEV, base.TEST].includes(node_env.mode)) {
    const swaggerOptions = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('知笙后台管理系统')
      .setDescription('知笙后台管理系统接口文档')
      .setVersion('1.0.0')
      .build();
    const swaggerDocuemnt = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('/api', app, swaggerDocuemnt);
  }
  await app.listen(node_env.port);
  console.info(banner);
  console.info(`${time()} ${node_env.mode} ${node_env.port}`);
}

bootstrap();
