import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { ClassroomChatModule } from '../classroom-chat/classroom-chat.module';

@Module({
  imports: [UserModule, ClassroomChatModule],
})
export class ClassroomMemberModule {}
