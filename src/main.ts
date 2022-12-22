import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * static views config
   */
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');


  await app.listen(process.env.PORT || 9000);
}
bootstrap();
