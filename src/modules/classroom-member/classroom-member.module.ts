import { Global, Module } from '@nestjs/common';

import { ClassroomMemberService } from './services/classroom-member.service';
import { ClassroomMemberController } from './controllers/classroom-member.controller';
import { ClassroomModule } from '../classroom/classroom.module';

@Global()
@Module({
  imports: [ClassroomModule],
  providers: [ClassroomMemberService],
  controllers: [ClassroomMemberController],
})
export class ClassroomMemberModule {}
