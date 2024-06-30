import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ClassroomModule } from '../classroom/classroom.module';
import { ClassroomChatService } from './services/classroom-chat.service';
import { ClassroomChatController } from './controllers/classroom-chat.controller';
import { ClassroomChatGateway } from './gateways/classroom-chat.websocket.gateway';
import { ClassroomMessageModule } from '../classroom-message/classroom-message.module';

@Global()
@Module({
  imports: [
    JwtModule,
    ClassroomModule,
    forwardRef(() => ClassroomMessageModule),
  ],
  controllers: [ClassroomChatController],
  providers: [ClassroomChatGateway, ClassroomChatService],
  exports: [ClassroomChatGateway, ClassroomChatService],
})
export class ClassroomChatModule {}
