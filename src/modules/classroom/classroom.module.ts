import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { ClassroomService } from './services/classroom.service';
import { ClassroomController } from './controllers/classroom.controller';
import { ClassroomMemberModule } from '../classroom-member/classroom-member.module';

@Module({
  imports: [UserModule, forwardRef(() => ClassroomMemberModule)],
  providers: [ClassroomService],
  exports: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
