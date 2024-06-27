import { Column, Entity, Index, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';

import { Message } from './message.entity';

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

  @OneToMany(() => Message, (message) => message.classroom_chat)
  chat_messages: Message[];
}
