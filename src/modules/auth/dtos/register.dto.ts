import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import {
  emailStringSchema,
  optionalStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';
import { userTypeSchema } from 'src/modules/user/dtos/user-type.schema';
import { UserAuthProviders } from 'src/modules/user/enums/user-auth-providers.enum';
import { userAuthProvidersSchema } from 'src/modules/user/dtos/user-auth-providers.schema';
import { UserTypeEnum } from 'src/modules/user/enums/user-type.enum';

export const registerSchema = z
  .object({
    user_email: emailStringSchema,
    password: optionalStringSchema,
    user_name: stringSchema,
    user_auth_provider: userAuthProvidersSchema.default(UserAuthProviders.EMAIL),
    user_type: userTypeSchema,
  })
  .refine(
    (data) =>
      data.user_auth_provider === UserAuthProviders.EMAIL && !data.password
        ? false
        : true,
    { message: 'Senha é obrigatoria' },
  );

export type RegisterPayload = z.infer<typeof registerSchema>;

export class RegisterDTO extends createZodDto(registerSchema) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  user_email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password?: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  user_name: string;

  @ApiProperty({
    description: 'The name of the user',
    example: UserTypeEnum.TEACHER,
  })
  user_type: UserTypeEnum;
}
