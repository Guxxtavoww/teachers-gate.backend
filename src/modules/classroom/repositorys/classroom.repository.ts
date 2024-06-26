import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { Classroom } from '../entities/classroom.entity';

export const classroomRepository: Repository<Classroom> =
  AppDataSource.getRepository(Classroom);
