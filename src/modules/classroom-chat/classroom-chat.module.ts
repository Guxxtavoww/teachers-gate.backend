import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MessageService } from './services/message.service';
import { ClassroomModule } from '../classroom/classroom.module';
import { MessageController } from './controllers/message.controller';
import { ClassroomChatService } from './services/classroom-chat.service';
import { ClassroomChatController } from './controllers/classroom-chat.controller';
import { ClassroomChatGateway } from './gateways/classroom-chat.websocket.gateway';

@Module({
  imports: [JwtModule, ClassroomModule],
  controllers: [MessageController, ClassroomChatController],
  providers: [ClassroomChatGateway, ClassroomChatService, MessageService],
})
export class ClassroomChatModule {}
