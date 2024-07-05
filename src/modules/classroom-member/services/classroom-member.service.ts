import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';

import { User } from 'src/modules/user/entities/user.entity';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { ClassroomMember } from '../entities/classroom-member.entity';
import { classroomMemberRepository } from '../repositories/classroom-member.repository';
import type { PaginateClassroomMembersPayload } from '../dtos/paginate-classroom-members.dto';

const baseColumns: (
  | `classroom_member.${keyof ClassroomMember}`
  | `classroom.${keyof Classroom}`
  | `user.${keyof User}`
)[] = [
  'classroom_member.id',
  'classroom_member.created_at',
  'classroom_member.updated_at',
  'classroom.id',
  'classroom.classroom_member_count',
  'user.id',
  'user.user_email',
  'user.user_type',
  'user.user_name',
];

@Injectable()
export class ClassroomMemberService {
  constructor(
    @Inject(forwardRef(() => ClassroomService))
    private readonly classroomService: ClassroomService,
    private readonly paginationService: PaginationService,
  ) {}

  createClassroomMemberQueryBuilder() {
    return classroomMemberRepository
      .createQueryBuilder('classroom_member')
      .leftJoinAndSelect('classroom_member.classroom', 'classroom')
      .leftJoinAndSelect('classroom_member.user', 'user')
      .select(baseColumns);
  }

  async getMembershipById(id: string) {
    const membership = await this.createClassroomMemberQueryBuilder()
      .where('classroom_member.id = :id', { id })
      .getOne();

    if (!membership) {
      throw new NotFoundError('Membership not valid');
    }

    return membership;
  }

  async getMembershipByUserId(user_id: string) {
    const membership = await this.createClassroomMemberQueryBuilder()
      .where('user.id = :user_id', { user_id })
      .getOne();

    if (!membership) {
      throw new NotFoundError('Membership not valid');
    }

    return membership;
  }

  async paginateClassroomMembers({
    page,
    limit,
    classroom_id,
    order_by_created_at,
    order_by_updated_at,
    user_id,
  }: PaginateClassroomMembersPayload) {
    const queryBuilder = this.createClassroomMemberQueryBuilder()
      .where(classroom_id ? 'classroom.id = :classroom_id' : '1=1', {
        classroom_id,
      })
      .andWhere(user_id ? 'user.id = :user_id' : '1=1', { user_id });

    if (order_by_created_at)
      queryBuilder.orderBy('classroom_member.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('classroom_member.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      page,
      limit,
    });
  }

  async getMemberByUserIdAndClassroomId(user_id: string, classroom_id: string) {
    const member = await this.createClassroomMemberQueryBuilder()
      .where('user.id = :user_id', { user_id })
      .andWhere('classroom.id = :classroom_id', { classroom_id })
      .getOne();

    return member;
  }

  async enterClassroom(logged_in_user_id: string, classroom_id: string) {
    const [classroom, membership] = await Promise.all([
      this.classroomService.getClassroomById(classroom_id),
      this.getMemberByUserIdAndClassroomId(logged_in_user_id, classroom_id),
    ]);

    if (membership) {
      throw new ForbiddenException('You already are in the classroom');
    }

    const classroomMemberToCreate = ClassroomMember.create(
      logged_in_user_id,
      classroom.id,
    );

    const [savedMember] = await Promise.all([
      classroomMemberRepository.save(classroomMemberToCreate),
      this.classroomService.handleClassroomStudentCount(classroom, 'increment'),
    ]);

    return savedMember;
  }

  async exitClassroom(logged_in_user_id: string, classroom_id: string) {
    const membership = await this.getMemberByUserIdAndClassroomId(
      logged_in_user_id,
      classroom_id,
    );

    if (!membership) return;

    await classroomMemberRepository.remove(membership);

    return this.classroomService.handleClassroomStudentCount(
      membership.classroom,
      'decrement',
    );
  }
}
