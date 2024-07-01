import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { CreateMessageDTO } from '../dtos/create-message.dto';
import { UpdateMessageDTO } from '../dtos/update-message.dto';
import { ClassroomMessageService } from '../services/classroom-message.service';
import { PaginateClassroomChatMessagesDTO } from '../dtos/paginate-classrooom-chat-messages.dto';

@ApiTags('classroom-message')
@Controller('classroom-message')
export class ClassroomMessageController {
  constructor(
    private readonly classroomMessageService: ClassroomMessageService,
  ) {}

  @Get('paginate')
  @ApiPaginationQuery()
  async paginateMessages(
    @Query() querys: PaginateClassroomChatMessagesDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomMessageService.paginateClassroomChatMessages(
      querys,
      decoded_token.id,
    );
  }

  @Post('send-message/:classroom_chat_id')
  async sendMessage(
    @UuidParam('classroom_chat_id') classroom_chat_id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
    @Body() body: CreateMessageDTO,
  ) {
    return this.classroomMessageService.sendMessage(
      classroom_chat_id,
      decoded_token.id,
      body,
    );
  }

  @Put(':id')
  async updateMessage(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
    @Body() body: UpdateMessageDTO,
  ) {
    return this.classroomMessageService.updateMessage(
      id,
      body,
      decoded_token.id,
    );
  }

  @Delete(':id')
  async deleteMessage(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomMessageService.deleteMessage(id, decoded_token.id);
  }
}
