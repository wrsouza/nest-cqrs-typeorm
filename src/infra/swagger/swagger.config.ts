import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ShopCart')
  .setDescription('ShopCart Api')
  .setVersion('1.0')
  .addTag('users')
  .build();
