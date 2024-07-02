import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Classrooms1719431092590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classrooms',
        columns: [
          ...baseColumns,
          {
            name: 'classroom_name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'classroom_description',
            type: 'varchar',
          },
          {
            name: 'teacher_id',
            type: 'uuid',
          },
          {
            name: 'classroom_member_count',
            type: 'int',
            default: 0,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'classrooms',
      new TableIndex({
        name: 'IDX_CLASSROOM_NAME',
        columnNames: ['classroom_name'],
      }),
    );

    await queryRunner.createIndex(
      'classrooms',
      new TableIndex({
        name: 'IDX_TEACHER_ID',
        columnNames: ['teacher_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'classrooms',
      new TableForeignKey({
        columnNames: ['teacher_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('classrooms');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('teacher_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('classrooms', foreignKey);
    await queryRunner.dropIndex('classrooms', 'IDX_TEACHER_ID');
    await queryRunner.dropIndex('classrooms', 'IDX_CLASSROOM_NAME');
    await queryRunner.dropTable('classrooms');
  }
}
