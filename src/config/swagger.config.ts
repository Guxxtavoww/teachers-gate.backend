import { DocumentBuilder } from '@nestjs/swagger';

export enum OrderByEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const swaggerConfig = new DocumentBuilder()
  .setTitle('ikut-backend')
  .setVersion('0.0.1')
  .addTag('auth')
  .addTag('user')
  .addTag('pet')
  .addTag('pet-species')
  .addTag('pet-breed')
  .addTag('mail')
  .addTag('google')
  .addTag('calendar')
  .addTag('post')
  .addTag('post-like')
  .addTag('post-comment')
  .addTag('friendship')
  .addBearerAuth()
  .addSecurityRequirements('bearer')
  .build();
