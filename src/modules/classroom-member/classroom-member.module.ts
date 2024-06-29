import { Module } from '@nestjs/common';

import { ClassroomService } from '../classroom/services/classroom.service';
import { ClassroomMemberService } from './services/classroom-member.service';
import { ClassroomChatModule } from '../classroom-chat/classroom-chat.module';
import { ClassroomChatController } from '../classroom-chat/controllers/classroom-chat.controller';

@Module({
  imports: [ClassroomChatModule, ClassroomService],
  providers: [ClassroomMemberService],
  controllers: [ClassroomChatController],
})
export class ClassroomMemberModule {}
