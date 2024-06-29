import { Injectable } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';

import type { CreateMessagePayload } from '../dtos/create-message.dto';
import { ClassroomChatService } from './classroom-chat.service';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly paginationService: PaginationService,
    private readonly classroomChatService: ClassroomChatService,
  ) {}

  async createMessage(
    classroom_chat_id: string,
    logged_in_user_id: string,
    payload: CreateMessagePayload,
  ) {
    await this.classroomChatService.getClassroomChatById(classroom_chat_id);

    const messageToCreate = Message.create({
      classroom_chat_id,
      message_owner_id: logged_in_user_id,
      ...payload,
    });
  }
}
