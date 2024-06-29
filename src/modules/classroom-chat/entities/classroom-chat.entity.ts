import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';

import { Message } from './message.entity';
import type { CreateClassroomChatPayload } from '../dtos/create-classroom-chat.dto';
import type { UpdateClassroomChatPayload } from '../dtos/update-classroom-chat.dto';

@Entity('classroom-chats')
export class ClassroomChat extends Base {
  @Index()
  @Column('varchar')
  chat_name: string;

  @Column('varchar')
  chat_description: string;

  @Index()
  @Column('uuid')
  classroom_id: string;

  @ManyToOne(() => Classroom, (classroom) => classroom.classroom_chats)
  classroom: Classroom;

  @OneToMany(() => Message, (message) => message.classroom_chat)
  chat_messages: Message[];

  static create(payload: CreateClassroomChatPayload) {
    const classroomChat = new ClassroomChat();

    Object.assign(classroomChat, payload);

    return classroomChat;
  }

  static update(payload: UpdateClassroomChatPayload) {
    const classroomChat = new ClassroomChat();

    Object.assign(classroomChat, payload);

    return classroomChat;
  }
}
