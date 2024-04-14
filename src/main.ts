import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //TODO:
  //app.useGlobalFilters(new HttpExceptionFilter());
  //app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.enableCors();
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = +process.env.API_PORT || 3200;
  await app.listen(port, () => {
    Logger.log(`Listening at http://localhost:${port}/${GLOBAL_PREFIX}`);
  });
}

bootstrap();
