import { Module, forwardRef } from '@nestjs/common';

import { ClassroomChatModule } from '../classroom-chat/classroom-chat.module';
import { ClassroomMessageService } from './services/classroom-message.service';
import { ClassroomMemberModule } from '../classroom-member/classroom-member.module';
import { ClassroomMessageController } from './controllers/classroom-message.controller';

@Module({
  imports: [ClassroomMemberModule, forwardRef(() => ClassroomChatModule)],
  providers: [ClassroomMessageService],
  controllers: [ClassroomMessageController],
  exports: [ClassroomMessageService],
})
export class ClassroomMessageModule {}
