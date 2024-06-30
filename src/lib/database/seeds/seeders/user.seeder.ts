/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { type Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';
import { UserAuthProviders } from 'src/modules/user/enums/user-auth-providers.enum';
import { UserTypeEnum } from 'src/modules/user/enums/user-type.enum';
import { createHashedPassword } from 'src/utils/password.utils';

export default class UserSeeder implements Seeder {
  track = false;

  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const newUser = userRepository.create({
      user_name: 'admin',
      user_email: 'user@example.com',
      user_type: UserTypeEnum.TEACHER,
      hashed_password: await createHashedPassword('password123'),
      user_auth_provider: UserAuthProviders.EMAIL,
      is_email_verified: false,
    });

    await userRepository.save(newUser);
  }
}
