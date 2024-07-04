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
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { ClassroomService } from '../services/classroom.service';
import { CreateClassroomDTO } from '../dtos/create-classroom.dto';
import { UpdateClassroomDTO } from '../dtos/update-classroom.dto';
import { PaginateClassroomsDTO } from '../dtos/paginate-classrooms.dto';

@ApiTags('classroom')
@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('paginate')
  @ApiPaginationQuery()
  paginate(@Query() querys: PaginateClassroomsDTO) {
    return this.classroomService.paginateClassrooms(querys);
  }

  @Get(':id')
  getOne(@UuidParam('id') id: string) {
    return this.classroomService.getClassroomById(id);
  }

  @Post()
  @DataBaseInterceptorDecorator()
  create(
    @DecodedToken() decoded_token: DecodedTokenType,
    @Body() payload: CreateClassroomDTO,
  ) {
    return this.classroomService.createClassroom(decoded_token, payload);
  }

  @Put(':id')
  update(
    @UuidParam('id') id: string,
    @Body() payload: UpdateClassroomDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomService.updateClassroom(id, decoded_token.id, payload);
  }

  @Delete(':id')
  delete(
    @UuidParam('id') id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.classroomService.deleteClassroom(id, decoded_token.id);
  }
}
