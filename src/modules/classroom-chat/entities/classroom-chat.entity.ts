import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';
import { ClassroomMessage } from 'src/modules/classroom-message/entities/classroom-message.entity';

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

  @OneToMany(() => ClassroomMessage, (message) => message.classroom_chat)
  chat_messages: ClassroomMessage[];

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
