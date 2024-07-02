import { Global, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { ClassroomService } from './services/classroom.service';
import { ClassroomController } from './controllers/classroom.controller';

@Global()
@Module({
  imports: [UserModule],
  providers: [ClassroomService],
  exports: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
