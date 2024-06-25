import { z } from 'nestjs-zod/z';

import { createNullableTransform } from 'src/utils/create-nullable-transform.util';

import { UserAuthProviders } from '../enums/user-auth-providers.enum';

export const userAuthProvidersSchema = z.nativeEnum(UserAuthProviders);

export const optionalUserAuthProvidersSchema = createNullableTransform(
  userAuthProvidersSchema,
);
