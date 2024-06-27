import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { ClassroomMember } from 'src/modules/classroom-member/entities/classroom-member.entity';

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

  @ManyToOne(
    () => ClassroomMember,
    (classroomMClassroomMember) => classroomMClassroomMember.sended_messages,
  )
  @JoinColumn({ name: 'message_owner_id' })
  message_owner: ClassroomMember;
}
