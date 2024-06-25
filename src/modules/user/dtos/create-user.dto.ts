import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  emailStringSchema,
  optionalStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';

import { userTypeSchema } from './user-type.schema';
import { UserAuthProviders } from '../enums/user-auth-providers.enum';
import { userAuthProvidersSchema } from './user-auth-providers.schema';

export const createUserSchema = z
  .object({
    user_name: stringSchema,
    user_email: emailStringSchema,
    user_type: userTypeSchema,
    password: optionalStringSchema,
    user_auth_provider: userAuthProvidersSchema.default(
      UserAuthProviders.EMAIL,
    ),
  })
  .refine(
    (data) => {
      if (data.user_auth_provider !== UserAuthProviders.EMAIL && !data.password)
        return false;

      return true;
    },
    { message: 'Password is required' },
  );

export type CreateUserPayload = z.infer<typeof createUserSchema> & {
  is_email_verified?: boolean;
};

export class CreateUserDTO extends createZodDto(createUserSchema) {}
