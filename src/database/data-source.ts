import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DB_TYPE } from '../config/constants';

const options: DataSourceOptions = {
  name: process.env.DEFAULT_TENANT,
  type: DB_TYPE,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + process.env.DB_ENTITIES_PATH],
  options: { trustServerCertificate: true },
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

export const dataSource = new DataSource(options);
