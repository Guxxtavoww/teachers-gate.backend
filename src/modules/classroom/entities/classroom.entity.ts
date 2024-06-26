import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Student } from 'src/modules/student/entities/student.entity';

@Entity('classrooms')
export class Classroom extends Base {
  @Column('varchar')
  classroom_name: string;

  @Column('uuid')
  teacher_id: string;

  @ManyToOne(() => User, (user) => user.tutoring_classrooms)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Student, (student) => student.classroom)
  students: Student[];
}
