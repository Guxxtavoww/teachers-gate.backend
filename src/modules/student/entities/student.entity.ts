import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Classroom } from 'src/modules/classroom/entities/classroom.entity';

@Entity('students')
export class Student extends Base {
  @Index()
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => Classroom, (classroom) => classroom.students)
  classroom: Classroom;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
