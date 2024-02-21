import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './module/auth/auth.service';
import { FileUploadModule } from './module/file-upload/file-upload.module';
import { SmsModule } from './module/sms/sms.module';
import { UserService } from './module/user/user.service';
import { UserController } from './module/user/user.controller';
import { UserModule } from './module/user/user.module';
import { GlobalExceptionFilter } from './filter/GlobalExceptionFilter';
import { AuthGuard } from './guard/authGuard';
import { APP_GUARD } from '@nestjs/core';
import { expireTime, jwtConstants } from './config/authConfig';
import { JwtModule } from '@nestjs/jwt';
import { currentEnv } from './config/config';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [currentEnv],
    }),
    ServeStaticModule.forRoot({
      rootPath: currentEnv().file.fileUploadPath,
      serveRoot: '/static/file',
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: expireTime },
    }),
    PrismaModule, FileUploadModule, SmsModule, UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GlobalExceptionFilter,
    AuthService, AppService, UserService,
  ],
})
export class AppModule {
}
