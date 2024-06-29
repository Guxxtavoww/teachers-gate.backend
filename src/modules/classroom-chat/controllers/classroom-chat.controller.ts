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

import { ClassroomChatService } from '../services/classroom-chat.service';
import { CreateClassroomChatDTO } from '../dtos/create-classroom-chat.dto';
import { UpdateClassroomChatDTO } from '../dtos/update-classroom-chat.dto';
import { PaginateClassroomChatsDTO } from '../dtos/paginate-classroom-chats.dto';

@ApiTags('classroom-chat')
@Controller('classroom-chat')
export class ClassroomChatController {
  constructor(private readonly chatroomChatService: ClassroomChatService) {}

  @Get('paginate')
  @ApiPaginationQuery()
  paginate(@Query() querys: PaginateClassroomChatsDTO) {
    return this.chatroomChatService.paginateClassroomsChats(querys);
  }

  @Get(':id')
  getOne(@UuidParam('id') id: string) {
    return this.chatroomChatService.getClassroomChatById(id);
  }

  @Post()
  create(
    @DecodedToken() decoded_token: DecodedTokenType,
    @Body() payload: CreateClassroomChatDTO,
  ) {
    return this.chatroomChatService.createClassroomChat(
      payload,
      decoded_token.id,
    );
  }

  @Put(':id')
  update(
    @UuidParam('id') id: string,
    @Body() payload: UpdateClassroomChatDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.chatroomChatService.updateClassroomChat(
      id,
      payload,
      decoded_token.id,
    );
  }

  @Delete(':id')
  delete(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.chatroomChatService.deleteClassroomChat(id, decoded_token.id);
  }
}
