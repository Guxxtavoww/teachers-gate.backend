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
import { Student } from 'src/modules/student/entities/student.entity';

import type { UpdateClassroomPayload } from '../dtos/update-classroom.dto';
import type { CreateClassroomPayload } from '../dtos/create-classroom.dto';

@Entity('classrooms')
export class Classroom extends Base {
  @Index()
  @Column('varchar', { unique: true })
  classroom_name: string;

  @Column('varchar')
  classroom_description: string;

  @Index()
  @Column('uuid')
  teacher_id: string;

  @Column('int', { default: 0 })
  classroom_student_count: number;

  @ManyToOne(() => User, (user) => user.tutoring_classrooms)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => Student, (student) => student.classroom)
  students: Student[];

  static create(payload: CreateClassroomPayload & { teacher_id: string }) {
    const classroom = new Classroom();

    Object.assign(classroom, payload);

    return classroom;
  }

  static update(payload: UpdateClassroomPayload) {
    const classroom = new Classroom();

    Object.assign(classroom, payload);

    return classroom;
  }
}
