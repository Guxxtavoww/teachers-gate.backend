import { Module } from '@nestjs/common';

import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { ClassroomChatService } from './services/classroom-chat.service';
import { ClassroomChatController } from './controllers/classroom-chat.controller';
import { ClassroomChatGateway } from './gateways/classroom-chat.websocket.gateway';

@Module({
  controllers: [MessageController, ClassroomChatController],
  providers: [ClassroomChatGateway, ClassroomChatService, MessageService],
})
export class ClassroomChatModule {}
