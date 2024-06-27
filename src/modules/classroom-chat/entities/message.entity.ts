import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { Student } from 'src/modules/student/entities/student.entity';

import { ClassroomChat } from './classroom-chat.entity';

@Entity('messages')
export class Message extends Base {
  @Column('varchar')
  content: string;

  @Index()
  @Column('uuid')
  classroom_chat_id: string;

  @Index()
  @Column('uuid')
  message_owner_id: string;

  @ManyToOne(() => ClassroomChat, (chat) => chat.chat_messages)
  @JoinColumn({ name: 'classroom_chat_id' })
  classroom_chat: ClassroomChat;

  @ManyToOne(() => Student, (student) => student.sended_messages)
  @JoinColumn({ name: 'message_owner_id' })
  message_owner: Student;
}
