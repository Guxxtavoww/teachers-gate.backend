import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';
import { ClassroomMessage } from 'src/modules/classroom-message/entities/classroom-message.entity';

@Entity('classroom-members')
export class ClassroomMember extends Base {
  @Index()
  @Column('uuid')
  user_id: string;

  @Index()
  @Column('uuid')
  classroom_id: string;

  @ManyToOne(() => Classroom, (classroom) => classroom.members)
  @JoinColumn({ name: 'classroom_id' })
  classroom: Classroom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ClassroomMessage, (message) => message.message_owner)
  sended_messages: ClassroomMessage[];

  static create(user_id: string, classroom_id: string) {
    const classroomMember = new ClassroomMember();

    classroomMember.classroom_id = classroom_id;
    classroomMember.user_id = user_id;

    return classroomMember;
  }
}
