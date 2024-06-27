import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Students1719499297681 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classroom-members',
        columns: [
          ...baseColumns,
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'classroom_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'classroom-members',
      new TableIndex({
        name: 'IDX_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'classroom-members',
      new TableIndex({
        name: 'IDX_CLASSROOM_MEMBER_ID',
        columnNames: ['classroom_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'classroom-members',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'classroom-members',
      new TableForeignKey({
        columnNames: ['classroom_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classrooms',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('classroom-members')) as Table;

    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    ) as TableForeignKey;

    const foreignKeyClassroom = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('classroom_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('classroom-members', foreignKeyUser);
    await queryRunner.dropForeignKey('classroom-members', foreignKeyClassroom);
    await queryRunner.dropIndex('classroom-members', 'IDX_USER_ID');
    await queryRunner.dropIndex('classroom-members', 'IDX_CLASSROOM_MEMBER_ID');
    await queryRunner.dropTable('classroom-members');
  }
}
