import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class ClassroomChats1719499313555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classroom-chats',
        columns: [
          ...baseColumns,
          {
            name: 'chat_name',
            type: 'varchar',
          },
          {
            name: 'chat_description',
            type: 'varchar',
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
      'classroom-chats',
      new TableIndex({
        name: 'IDX_CHAT_NAME',
        columnNames: ['chat_name'],
      }),
    );

    await queryRunner.createIndex(
      'classroom-chats',
      new TableIndex({
        name: 'IDX_CLASSROOM_ID',
        columnNames: ['classroom_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'classroom-chats',
      new TableForeignKey({
        columnNames: ['classroom_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classrooms',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('classroom-chats')) as Table;

    const foreignKeyClassroom = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('classroom_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('classroom-chats', foreignKeyClassroom);
    await queryRunner.dropIndex('classroom-chats', 'IDX_CHAT_NAME');
    await queryRunner.dropIndex('classroom-chats', 'IDX_CLASSROOM_ID');
    await queryRunner.dropTable('classroom-chats');
  }
}
