import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JWT_EXPIRES_IN, JWT_SECRET, loadConfig } from 'src/config';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { TenantModule } from '../tenant/tenant.module';

@Module({
  imports: [
    UserModule,
    TenantModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        loadConfig(configService);
        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: JWT_EXPIRES_IN },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
