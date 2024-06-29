import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MessageService } from './services/message.service';
import { ClassroomModule } from '../classroom/classroom.module';
import { MessageController } from './controllers/message.controller';
import { ClassroomChatService } from './services/classroom-chat.service';
import { ClassroomChatController } from './controllers/classroom-chat.controller';
import { ClassroomChatGateway } from './gateways/classroom-chat.websocket.gateway';
import { ClassroomMemberModule } from '../classroom-member/classroom-member.module';

@Module({
  imports: [JwtModule, ClassroomModule, ClassroomMemberModule],
  controllers: [MessageController, ClassroomChatController],
  providers: [ClassroomChatGateway, ClassroomChatService, MessageService],
})
export class ClassroomChatModule {}
