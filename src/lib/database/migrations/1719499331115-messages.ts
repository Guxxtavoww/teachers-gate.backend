import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

import { baseColumns } from '../entities/base-columns';

export class Messages1719499331115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classroom-messages',
        columns: [
          ...baseColumns,
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'classroom_chat_id',
            type: 'uuid',
          },
          {
            name: 'message_owner_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'classroom-messages',
      new TableIndex({
        name: 'IDX_CLASSROOM_CHAT_ID',
        columnNames: ['classroom_chat_id'],
      }),
    );

    await queryRunner.createIndex(
      'classroom-messages',
      new TableIndex({
        name: 'IDX_MESSAGE_OWNER_ID',
        columnNames: ['message_owner_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'classroom-messages',
      new TableForeignKey({
        columnNames: ['classroom_chat_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom-chats',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'classroom-messages',
      new TableForeignKey({
        columnNames: ['message_owner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classroom-members',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = (await queryRunner.getTable('classroom-messages')) as Table;

    const foreignKeyChat = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('classroom_chat_id') !== -1,
    ) as TableForeignKey;

    const foreignKeyOwner = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('message_owner_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('classroom-messages', foreignKeyChat);
    await queryRunner.dropForeignKey('classroom-messages', foreignKeyOwner);
    await queryRunner.dropIndex('classroom-messages', 'IDX_CLASSROOM_CHAT_ID');
    await queryRunner.dropIndex('classroom-messages', 'IDX_MESSAGE_OWNER_ID');
    await queryRunner.dropTable('classroom-messages');
  }
}
