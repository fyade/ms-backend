import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { currentEnv } from './config/config';
import { time } from './util/TimeUtils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { base } from './util/base';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    req['TIMEZONE'] = 'Asia/Shanghai'; // 设置全局时区
    next();
  });
  const node_env = currentEnv();
  if (node_env.mode === base.DEV) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('知笙管理系统接口文档')
      .setDescription('文档')
      .setVersion('1.0.0')
      .build();
    const swaggerDocuemnt = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('/api', app, swaggerDocuemnt);
  }
  await app.listen(node_env.port);
  console.log(`${time()} ${node_env.mode} ${node_env.port}`);
}

bootstrap();
