import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

import {
  UserAuthProviders,
  user_auth_providers,
} from 'src/modules/user/enums/user-auth-providers.enum';
import { users_types } from 'src/modules/user/enums/user-type.enum';

import { baseColumns } from '../entities/base-columns';

export class Users1719274509300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          ...baseColumns,
          {
            name: 'user_name',
            type: 'varchar',
          },
          {
            name: 'hashed_password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'user_email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'user_type',
            type: 'enum',
            enum: users_types,
          },
          {
            name: 'is_email_verified',
            type: 'boolean',
            default: false,
          },
          {
            name: 'user_auth_provider',
            type: 'enum',
            enum: user_auth_providers,
            default: `'${UserAuthProviders.EMAIL}'`,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_NAME',
        columnNames: ['user_name'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['user_email'],
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_USER_TYPE',
        columnNames: ['user_type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'IDX_USER_NAME');
    await queryRunner.dropIndex('users', 'IDX_USER_TYPE');
    await queryRunner.dropIndex('users', 'IDX_USER_EMAIL');
    await queryRunner.dropTable('users');
  }
}
