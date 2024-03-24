import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/sys/user/user.module';
import { GlobalExceptionFilter } from './filter/GlobalExceptionFilter';
import { AuthGuard } from './guard/authGuard';
import { APP_GUARD } from '@nestjs/core';
import { expireTime, jwtConstants } from './config/authConfig';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { currentEnv } from './config/config';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileUploadModule } from './module/common/file-upload/file-upload.module';
import { SmsModule } from './module/common/sms/sms.module';
import { MenuModule } from './module/sys/menu/menu.module';
import { AuthService } from './module/sys/auth/auth.service';
import { RoleModule } from './module/sys/role/role.module';
import { PermissionModule } from './module/sys/permission/permission.module';
import { UserRoleModule } from './module/sys/user-role/user-role.module';
import { RolePermissionModule } from './module/sys/role-permission/role-permission.module';

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
    PrismaModule,
    FileUploadModule,
    SmsModule,
    UserModule,
    MenuModule,
    RoleModule,
    PermissionModule,
    UserRoleModule,
    RolePermissionModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GlobalExceptionFilter,
    AppService,
    AuthService,
    JwtService,
  ],
})
export class AppModule {
}
