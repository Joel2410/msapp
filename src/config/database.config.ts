import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DB_TYPE } from 'src/helpers';

export let DB_HOST = '';
export let DB_PORT = 1433;
export let DB_USERNAME = 'sa';
export let DB_PASSWORD = 'super_secret';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    DB_HOST = configService.get('DB_HOST');
    DB_PORT = +configService.get('DB_PORT');
    DB_USERNAME = configService.get('DB_USERNAME');
    DB_PASSWORD = configService.get('DB_PASSWORD');

    return {
      name: 'principalConnection',
      type: DB_TYPE,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: configService.get('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      options: { trustServerCertificate: true },
      synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
    };
  },
};
