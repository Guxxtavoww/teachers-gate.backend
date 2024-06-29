import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { ClassroomMember } from '../entities/classroom-member.entity';

export const classroomMemberRepository: Repository<ClassroomMember> =
  AppDataSource.getRepository(ClassroomMember);
