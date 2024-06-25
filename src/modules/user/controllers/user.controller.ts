import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

import { UserService } from '../services/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
