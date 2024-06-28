import {
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket, Server } from 'socket.io';

import { ENV_VARIABLES } from 'src/config/env.config';
import { allowedDomains } from 'src/config/cors.config';

import { MessageService } from '../services/message.service';
import { ClassroomChatService } from '../services/classroom-chat.service';

@WebSocketGateway(ENV_VARIABLES.WEBSOCKET_PORT, {
  namespace: 'classroom-chat',
  cors: allowedDomains,
})
export class ClassroomChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly classroomChatService: ClassroomChatService,
    private readonly messageService: MessageService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token;

    if (!token) return socket.disconnect();

    // const verifiedToken: DecodedTokenType = await this.jwtService.verifyAsync(token, {
    //   secret: ENV_VARIABLES.JWT_SECRET,
    // });    
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const socketId = socket.id;
    console.log(`Disconnection... socket id:`, socketId);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    Logger.log(message);
  }
}
