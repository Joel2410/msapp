import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

export let JWT_SECRET = 'superSecret';
export let JWT_EXPIRES_IN = '300s';

export const loadConfig = (configService: ConfigService): void => {
  JWT_SECRET = configService.get('JWT_SECRET');
  JWT_EXPIRES_IN = configService.get('JWT_EXPIRES_IN');
};

export const validationSchema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(1433),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  API_PORT: Joi.number().default(3200),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('300s'),
});
