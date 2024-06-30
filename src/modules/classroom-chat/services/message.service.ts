import { ForbiddenException, Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { ClassroomMemberService } from 'src/modules/classroom-member/services/classroom-member.service';

import { Message } from '../entities/message.entity';
import { ClassroomChatService } from './classroom-chat.service';
import { messageRepository } from '../repositories/message.repository';
import type { CreateMessagePayload } from '../dtos/create-message.dto';
import type { UpdateMessagePayload } from '../dtos/update-message.dto';
import type { PaginateClassroomChatMessagesPayload } from '../dtos/paginate-classrooom-chat-messages.dto';

const baseColumns: `message.${keyof Message}`[] = [
  'message.id',
  'message.content',
  'message.created_at',
  'message.updated_at',
  'message.message_owner_id',
  'message.classroom_chat_id',
];

@Injectable()
export class MessageService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly classroomChatService: ClassroomChatService,
    private readonly classroomMemberService: ClassroomMemberService,
  ) {}

  private createMessageQueryBuilder() {
    return messageRepository.createQueryBuilder().select(baseColumns);
  }

  async paginateClassroomChatMessages(
    {
      classromm_chat_id,
      limit,
      page,
      order_by_created_at,
      order_by_updated_at,
    }: PaginateClassroomChatMessagesPayload,
    logged_in_user_id: string,
  ) {
    const queryBuilder = this.createMessageQueryBuilder().where(
      'message.classroom_chat_id = :classroom_chat_id',
      { classromm_chat_id },
    );

    if (order_by_created_at)
      queryBuilder.orderBy('message.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('message.updated_at', order_by_updated_at);

    const { items, meta } =
      await this.paginationService.paginateWithQueryBuilder(queryBuilder, {
        limit,
        page,
      });

    return {
      items: items.map((item) => ({
        ...item,
        current_user_owns_message: item.message_owner_id === logged_in_user_id,
      })),
      meta,
    };
  }

  async getMessageById(id: string) {
    const message = await this.createMessageQueryBuilder()
      .where('message.id = :id', { id })
      .getOne();

    if (!message) throw new NotFoundError('Invalid message');

    return message;
  }

  async sendMessage(
    classroom_chat_id: string,
    logged_in_user_id: string,
    payload: CreateMessagePayload,
  ) {
    const chat =
      await this.classroomChatService.getClassroomChatById(classroom_chat_id);

    const membership =
      await this.classroomMemberService.getMemberByUserIdAndClassroomId(
        logged_in_user_id,
        chat.classroom.id,
      );

    if (!membership) throw new NotFoundError('Not a part of this classroom');

    const messageToCreate = Message.create({
      classroom_chat_id: chat.id,
      message_owner_id: membership.user.id,
      ...payload,
    });

    return messageRepository.save(messageToCreate);
  }

  private checkPermission(message_owner_id: string, logged_in_user_id: string) {
    if (message_owner_id !== logged_in_user_id) {
      throw new ForbiddenException(
        'Only the owner is allowed to change or delete',
      );
    }
  }

  async updateMessage(
    id: string,
    payload: UpdateMessagePayload,
    logged_in_user_id: string,
  ) {
    const messageToUpdate = await this.getMessageById(id);

    this.checkPermission(messageToUpdate.message_owner_id, logged_in_user_id);

    const message = Message.update(payload);

    return messageRepository.update(messageToUpdate.id, message);
  }

  async deleteMessage(id: string, logged_in_user_id: string) {
    const messageToDelete = await this.getMessageById(id);

    this.checkPermission(messageToDelete.message_owner_id, logged_in_user_id);

    return messageRepository.remove(messageToDelete);
  }
}
