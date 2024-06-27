import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  //   SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ClassroomChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  async handleConnection(socket: Socket): Promise<void> {
    const socketId = socket.id;
    console.log(`New connecting... socket id:`, socketId);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const socketId = socket.id;
    console.log(`Disconnection... socket id:`, socketId);
  }
}
