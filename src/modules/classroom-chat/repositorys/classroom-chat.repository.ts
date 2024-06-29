import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { ClassroomChat } from '../entities/classroom-chat.entity';

export const classroomChatRepository: Repository<ClassroomChat> =
  AppDataSource.getRepository(ClassroomChat);
