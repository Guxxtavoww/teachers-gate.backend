import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { ClassroomMessage } from '../entities/classroom-message.entity';

export const classroomMessageRepository: Repository<ClassroomMessage> =
  AppDataSource.getRepository(ClassroomMessage);
