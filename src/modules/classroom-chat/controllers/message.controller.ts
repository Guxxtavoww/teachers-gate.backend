import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('message')
@Controller('message')
export class MessageController {}
