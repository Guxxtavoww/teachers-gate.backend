import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';
import { Message } from 'src/modules/classroom-chat/entities/message.entity';

@Entity('students')
export class Student extends Base {
  @Index()
  @Column('uuid')
  user_id: string;

  @Index()
  @Column('uuid')
  classroom_id: string

  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Message, (message) => message.message_onwer)
  sended_messages: Message[]
}
