import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

import { ENV_VARIABLES } from 'src/config/env.config';
import { allowedDomains } from 'src/config/cors.config';
import { ClassroomMessageService } from 'src/modules/classroom-message/services/classroom-message.service';

import { MessageBodyDTO } from '../dtos/message-body.dto';

@WebSocketGateway(ENV_VARIABLES.WEBSOCKET_PORT, {
  namespace: 'classroom-chat',
  cors: allowedDomains,
})
export class ClassroomChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => ClassroomMessageService))
    private readonly messageService: ClassroomMessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    try {
      const token = socket.handshake.auth.token;

      if (!token) return socket.disconnect();

      const verifiedToken: DecodedTokenType = await this.jwtService.verifyAsync(
        token,
        {
          secret: ENV_VARIABLES.JWT_SECRET,
        },
      );

      Logger.log(`Connected as id: ${verifiedToken.id}`);
    } catch {
      return socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const socketId = socket.id;
    console.log(`Disconnection... socket id:`, socketId);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() payload: MessageBodyDTO) {
    const savedMessage = await this.messageService.sendMessage(
      payload.classroom_chat_id,
      payload.user_id,
      { content: payload.content },
    );

    return this.server.emit('new-message', savedMessage);
  }
}
