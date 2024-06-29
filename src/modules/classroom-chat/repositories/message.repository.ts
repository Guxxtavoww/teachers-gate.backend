import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { Message } from '../entities/message.entity';

export const messageRepository: Repository<Message> =
  AppDataSource.getRepository(Message);
