import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';

import { ClassroomMemberService } from '../services/classroom-member.service';
import { PaginateClassroomMembersDTO } from '../dtos/paginate-classroom-members.dto';

@ApiTags('classroom-member')
@Controller('classroom-member')
export class ClassroomMemberController {
  constructor(
    private readonly classroomMemberService: ClassroomMemberService,
  ) {}

  @Get('paginate')
  paginate(@Query() querys: PaginateClassroomMembersDTO) {
    return this.classroomMemberService.paginateClassroomMembers(querys);
  }

  @Post('enter-classroom/:classroom_id')
  enterClassroom(
    @UuidParam('classroom_id') classroom_id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomMemberService.enterClassroom(
      decoded_token.id,
      classroom_id,
    );
  }

  @Delete('exit-classroom/:classroom_id')
  exitClassroom(
    @UuidParam('classroom_id') classroom_id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomMemberService.exitClassroom(
      decoded_token.id,
      classroom_id,
    );
  }
}
