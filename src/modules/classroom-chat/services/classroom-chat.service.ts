import { ForbiddenException, Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';
import { ClassroomService } from 'src/modules/classroom/services/classroom.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { ClassroomChat } from '../entities/classroom-chat.entity';
import { classroomChatRepository } from '../repositories/classroom-chat.repository';
import type { CreateClassroomChatPayload } from '../dtos/create-classroom-chat.dto';
import type { UpdateClassroomChatPayload } from '../dtos/update-classroom-chat.dto';
import type { PaginateClassroomChatsPayload } from '../dtos/paginate-classroom-chats.dto';

const baseColumns: (
  | `classroom_chat.${keyof ClassroomChat}`
  | `classroom.${keyof Classroom}`
)[] = [
  'classroom_chat.id',
  'classroom_chat.chat_name',
  'classroom_chat.chat_description',
  'classroom_chat.created_at',
  'classroom_chat.updated_at',
  'classroom.id',
  'classroom.teacher_id',
  'classroom.classroom_name',
];

@Injectable()
export class ClassroomChatService {
  constructor(
    private readonly classroomService: ClassroomService,
    private readonly paginationService: PaginationService,
  ) {}

  private createClassroomChatQueryBuilder() {
    return classroomChatRepository
      .createQueryBuilder('classroom_chat')
      .leftJoinAndSelect('classroom_chat.classroom', 'classroom')
      .select(baseColumns);
  }

  private checkPermission(
    logged_in_user_id: string,
    classroomTeacherId: string,
  ) {
    if (classroomTeacherId !== logged_in_user_id) {
      throw new ForbiddenException(
        'Only the teacher is allowed to change or delete the chat',
      );
    }
  }

  async paginateClassroomsChats({
    chat_description,
    chat_name,
    classroom_id,
    limit,
    order_by_created_at,
    order_by_updated_at,
    page,
  }: PaginateClassroomChatsPayload) {
    const queryBuilder = this.createClassroomChatQueryBuilder()
      .where(
        chat_name ? 'LOWER(classroom_chat.chat_name) LIKE :chat_name' : '1=1',
        {
          chat_name: `%${chat_name}%`,
        },
      )
      .andWhere(
        chat_description
          ? 'LOWER(classroom_chat.chat_description) LIKE :chat_description'
          : '1=1',
        {
          chat_description: `%${chat_description}%`,
        },
      )
      .andWhere(classroom_id ? 'classroom.id = :classroom_id' : '1=1', {
        classroom_id,
      });

    if (order_by_created_at)
      queryBuilder.orderBy('classroom_chat.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('classroom_chat.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      limit,
      page,
    });
  }

  async getClassroomChatById(id: string): Promise<ClassroomChat> {
    const classroomChat = await this.createClassroomChatQueryBuilder()
      .where('classroom_chat.id = :id', { id })
      .getOne();

    if (!classroomChat) {
      throw new NotFoundError('Classroom Chat not founded');
    }

    return classroomChat;
  }

  async createClassroomChat(
    payload: CreateClassroomChatPayload,
    logged_in_user_id: string,
  ) {
    const classroom = await this.classroomService.getClassroomById(
      payload.classroom_id,
    );

    if (classroom.teacher.id !== logged_in_user_id) {
      throw new ForbiddenException(
        'Only the teacher is allowed to create classrooms chats',
      );
    }

    const classroomChatToCreate = ClassroomChat.create(payload);

    return classroomChatRepository.save(classroomChatToCreate);
  }

  async updateClassroomChat(
    id: string,
    payload: UpdateClassroomChatPayload,
    logged_in_user_id: string,
  ) {
    const classroomChatToUpdate = await this.getClassroomChatById(id);

    this.checkPermission(
      logged_in_user_id,
      classroomChatToUpdate.classroom.teacher_id,
    );

    await classroomChatRepository.update(
      classroomChatToUpdate.id,
      ClassroomChat.update(payload),
    );

    return this.getClassroomChatById(classroomChatToUpdate.id);
  }

  async deleteClassroomChat(id: string, logged_in_user_id: string) {
    const classroomChatToDelete = await this.getClassroomChatById(id);

    this.checkPermission(
      logged_in_user_id,
      classroomChatToDelete.classroom.teacher_id,
    );

    return classroomChatRepository.delete(classroomChatToDelete.id);
  }
}
