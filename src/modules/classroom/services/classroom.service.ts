import { ForbiddenException, Injectable } from '@nestjs/common';

import { User } from 'src/modules/user/entities/user.entity';
import { UserTypeEnum } from 'src/modules/user/enums/user-type.enum';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { Classroom } from '../entities/classroom.entity';
import { classroomRepository } from '../repositorys/classroom.repository';
import type { CreateClassroomPayload } from '../dtos/create-classroom.dto';
import type { UpdateClassroomPayload } from '../dtos/update-classroom.dto';
import type { PaginateClassroomsPayload } from '../dtos/paginate-classrooms.dto';

@Injectable()
export class ClassroomService {
  constructor(private readonly paginationService: PaginationService) {}

  private checkPermission(logged_in_user_id: string, teacher_id: string) {
    if (logged_in_user_id !== teacher_id) {
      throw new ForbiddenException('You cant alter this classroom');
    }
  }

  private createClassroomQueryBuilder() {
    const base_select: (
      | `classroom.${keyof Classroom}`
      | `teacher.${keyof User}`
    )[] = [
      'classroom.id',
      'classroom.created_at',
      'classroom.updated_at',
      'classroom.classroom_description',
      'classroom.classroom_name',
      'classroom.classroom_member_count',
      'teacher.id',
      'teacher.user_email',
      'teacher.user_name',
    ];

    return classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.teacher', 'teacher')
      .select(base_select);
  }

  async paginateClassrooms({
    limit,
    page,
    order_by_created_at,
    order_by_updated_at,
    classroom_name,
    teacher_id,
  }: PaginateClassroomsPayload) {
    const queryBuilder = this.createClassroomQueryBuilder()
      .where(
        classroom_name
          ? 'LOWER(classroom.classroom_name) LIKE :classroom_name'
          : '1=1',
        {
          classroom_name: `%${classroom_name}%`,
        },
      )
      .andWhere(teacher_id ? 'teacher.id = teacher_id' : '1=1', { teacher_id });

    if (order_by_created_at)
      queryBuilder.orderBy('classroom.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('classroom.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      page,
      limit,
    });
  }

  async handleClassroomStudentCount(classroom: Classroom, type: CountHandler) {
    if (classroom.classroom_member_count === 0 && type === 'decrement')
      throw new BadRequestError('Cant decrement');

    classroom.classroom_member_count += type === 'increment' ? 1 : -1;

    return classroomRepository.update(classroom.id, {
      classroom_member_count: classroom.classroom_member_count,
    });
  }

  async getClassroomById(id: string) {
    const classroom = await this.createClassroomQueryBuilder()
      .where('classroom.id = :id', { id })
      .getOne();

    if (!classroom) {
      throw new NotFoundError('Classroom not founded!');
    }

    return classroom;
  }

  async createClassroom(
    logged_in_user: DecodedTokenType,
    payload: CreateClassroomPayload,
  ) {
    if (logged_in_user.user_type !== UserTypeEnum.TEACHER) {
      throw new ForbiddenException(
        'Only teachers are allowed to create classrooms',
      );
    }

    const classroomToCreate = Classroom.create({
      ...payload,
      teacher_id: logged_in_user.id,
    });

    return classroomRepository.save(classroomToCreate);
  }

  async updateClassroom(
    id: string,
    logged_in_user_id: string,
    payload: UpdateClassroomPayload,
  ) {
    const { id: classroom_id, teacher } = await this.getClassroomById(id);

    this.checkPermission(logged_in_user_id, teacher.id);

    const classroom = Classroom.update(payload);

    await classroomRepository.update(classroom_id, classroom);

    return this.getClassroomById(classroom_id);
  }

  async deleteClassroom(id: string, logged_in_user_id: string) {
    const classroomToDelete = await this.getClassroomById(id);

    this.checkPermission(logged_in_user_id, classroomToDelete.teacher.id);

    return classroomRepository.delete(classroomToDelete.id);
  }
}
