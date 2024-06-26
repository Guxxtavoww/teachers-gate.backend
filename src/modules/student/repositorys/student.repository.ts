import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { Student } from '../entities/student.entity';

export const studentRepository: Repository<Student> =
  AppDataSource.getRepository(Student);
