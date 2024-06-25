import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import { optionalStringSchema } from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

import { optionalUserTypeSchema } from './user-type.schema';
import { optionalUserAuthProvidersSchema } from './user-auth-providers.schema';

export const paginateUsersSchema = createPaginationSchema({
  user_name: optionalStringSchema,
  user_type: optionalUserTypeSchema,
  user_auth_provider: optionalUserAuthProvidersSchema,
});

export type PaginateUsersPayload = z.infer<typeof paginateUsersSchema>;

export class PaginateUsersDTO extends createZodDto(paginateUsersSchema) {}
