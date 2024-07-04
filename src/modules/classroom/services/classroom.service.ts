import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';

import { User } from 'src/modules/user/entities/user.entity';
import { UserTypeEnum } from 'src/modules/user/enums/user-type.enum';
import { UserService } from 'src/modules/user/services/user.service';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';
import { ClassroomMemberService } from 'src/modules/classroom-member/services/classroom-member.service';

import { Classroom } from '../entities/classroom.entity';
import { classroomRepository } from '../repositorys/classroom.repository';
import type { CreateClassroomPayload } from '../dtos/create-classroom.dto';
import type { UpdateClassroomPayload } from '../dtos/update-classroom.dto';
import type { PaginateClassroomsPayload } from '../dtos/paginate-classrooms.dto';

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

@Injectable()
export class ClassroomService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => ClassroomMemberService))
    private readonly classroomMemberService: ClassroomMemberService,
  ) {}

  private checkPermission(logged_in_user_id: string, teacher_id: string) {
    if (logged_in_user_id !== teacher_id) {
      throw new ForbiddenException('You cant alter this classroom');
    }
  }

  private createClassroomQueryBuilder() {
    return classroomRepository
      .createQueryBuilder('classroom')
      .leftJoinAndSelect('classroom.teacher', 'teacher')
      .select(base_select);
  }

  async paginateClassrooms(
    {
      limit,
      page,
      order_by_created_at,
      order_by_updated_at,
      classroom_name,
      teacher_id,
      order_by_most_members,
    }: PaginateClassroomsPayload,
    logged_in_user_id: string,
  ) {
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

    if (order_by_most_members)
      queryBuilder.orderBy(
        'classroom.classroom_member_count',
        order_by_most_members,
      );

    const paginationResult =
      await this.paginationService.paginateWithQueryBuilder(queryBuilder, {
        page,
        limit,
      });

    if (!paginationResult.items.length) return paginationResult;

    const { items, meta } = paginationResult;

    const clasrooms_ids = items.map((clasroom) => clasroom.id);

    const classroomsMembers = await this.classroomMemberService
      .createClassroomMemberQueryBuilder()
      .where('classroom.id IN (:...clasrooms_ids)', { clasrooms_ids })
      .andWhere('user.id = :logged_in_user_id', { logged_in_user_id })
      .take(clasrooms_ids.length)
      .getMany();

    const classroomMembersIds = new Set(
      classroomsMembers.map(
        (classroomsMember) => classroomsMember.classroom.id,
      ),
    );

    return {
      items: items.map((classroom) => ({
        ...classroom,
        is_current_user_member: classroomMembersIds.has(classroom.id),
      })),
      meta,
    };
  }

  async handleClassroomStudentCount(classroom: Classroom, type: CountHandler) {
    if (classroom.classroom_member_count === 0 && type === 'decrement')
      throw new BadRequestError('Cant decrement');

    classroom.classroom_member_count += type === 'increment' ? 1 : -1;

    return classroomRepository.update(classroom.id, {
      classroom_member_count: classroom.classroom_member_count,
    });
  }

  async getClassroomById(id: string, logged_in_user_id?: string) {
    const classroom = await this.createClassroomQueryBuilder()
      .where('classroom.id = :id', { id })
      .getOne();

    if (!classroom) {
      throw new NotFoundError('Classroom not founded!');
    }

    if (logged_in_user_id) {
      const is_current_user_member =
        !!(await this.classroomMemberService.getMemberByUserIdAndClassroomId(
          logged_in_user_id,
          classroom.id,
        ));

      return { ...classroom, is_current_user_member };
    }

    return classroom;
  }

  async createClassroom(
    logged_in_user: DecodedTokenType,
    payload: CreateClassroomPayload,
  ) {
    const { user_type } = await this.userService.getUserById(logged_in_user.id);

    if (user_type !== UserTypeEnum.TEACHER) {
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
