import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { ClassroomMessageService } from '../services/classroom-message.service';

@ApiTags('classroom-message')
@Controller('classroom-message')
export class ClassroomMessageController {
  constructor(
    private readonly classroomMessageService: ClassroomMessageService,
  ) {}

  
}
