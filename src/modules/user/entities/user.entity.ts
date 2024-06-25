import { Column, Entity, Index } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { UserTypeEnum } from '../enums/user-type.enum';
import type { CreateUserPayload } from '../dtos/create-user.dto';
import type { UpdateUserPayload } from '../dtos/update-user.dto';
import { UserAuthProviders } from '../enums/user-auth-providers.enum';

@Entity('users')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column('varchar', { nullable: true })
  hashed_password: NullableValue<string>;

  @Index()
  @Column('varchar')
  user_email: string;

  @Index()
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
  })
  user_type: UserTypeEnum;

  @Column({
    type: 'enum',
    enum: UserAuthProviders,
    default: UserAuthProviders.EMAIl,
  })
  user_auth_provider: UserAuthProviders;

  @Column('boolean', { default: false })
  is_email_verified: boolean;

  private static async handleCreateHashedPassword(
    password: string,
  ): Promise<string> {
    return import('src/utils/password.utils').then(({ createHashedPassword }) =>
      createHashedPassword(password),
    );
  }

  static async create({ password, ...payload }: CreateUserPayload) {
    const userItem = new User();

    const hashed_password = password
      ? await this.handleCreateHashedPassword(password)
      : null;

    Object.assign(userItem, { ...payload, hashed_password });

    return userItem;
  }

  static async update(
    { new_password, previous_password, ...payload }: UpdateUserPayload,
    database_password: NullableValue<string>,
  ) {
    const userItem = new User();

    if (new_password) {
      if (!previous_password)
        throw new BadRequestError(
          'Previous password is required when setting a new password.',
        );

      if (database_password) {
        const { validatePassword } = await import('src/utils/password.utils');

        const isMatch = await validatePassword(
          previous_password,
          database_password,
        );

        if (!isMatch)
          throw new BadRequestError('Previous password is incorrect.');
      }

      userItem.hashed_password =
        await this.handleCreateHashedPassword(new_password);
    }

    Object.assign(userItem, payload);

    return userItem;
  }
}
