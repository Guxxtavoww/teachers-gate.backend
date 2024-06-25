import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import {
  emailStringSchema,
  optionalStringSchema,
} from 'src/shared/schemas.shared';
import { UserAuthProviders } from 'src/modules/user/enums/user-auth-providers.enum';
import { userAuthProvidersSchema } from 'src/modules/user/dtos/user-auth-providers.schema';

export const loginSchema = z
  .object({
    user_email: emailStringSchema,
    password: optionalStringSchema,
    auth_provider: userAuthProvidersSchema.default(UserAuthProviders.EMAIL),
  })
  .refine(
    (data) =>
      data.auth_provider === UserAuthProviders.EMAIL && !data.password
        ? false
        : true,
    { message: 'Senha é obrigatoria' },
  );

export type LoginPayload = z.infer<typeof loginSchema>;

export class LoginDTO extends createZodDto(loginSchema) {
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
}
