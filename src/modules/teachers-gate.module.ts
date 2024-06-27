import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomModule } from './classroom/classroom.module';
import { ClassroomChatModule } from './classroom-chat/classroom-chat.module';
import { ClassroomMemberModule } from './classroom-member/classroom-member.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EmailConfirmationModule,
    ClassroomModule,
    ClassroomChatModule,
    ClassroomMemberModule,
  ],
})
export class TeachersGateModule {}
