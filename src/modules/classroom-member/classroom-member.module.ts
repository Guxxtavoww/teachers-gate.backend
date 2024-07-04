import { forwardRef, Module } from '@nestjs/common';

import { ClassroomModule } from '../classroom/classroom.module';
import { ClassroomMemberService } from './services/classroom-member.service';
import { ClassroomMemberController } from './controllers/classroom-member.controller';

@Module({
  imports: [forwardRef(() => ClassroomModule)],
  providers: [ClassroomMemberService],
  controllers: [ClassroomMemberController],
  exports: [ClassroomMemberService],
})
export class ClassroomMemberModule {}
