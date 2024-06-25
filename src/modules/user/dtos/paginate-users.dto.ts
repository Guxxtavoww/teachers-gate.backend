import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { optionalStringSchema } from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

import { UserTypeEnum } from '../enums/user-type.enum';
import { optionalUserTypeSchema } from './user-type.schema';
import { UserAuthProviders } from '../enums/user-auth-providers.enum';
import { optionalUserAuthProvidersSchema } from './user-auth-providers.schema';

export const paginateUsersSchema = createPaginationSchema({
  user_name: optionalStringSchema,
  user_type: optionalUserTypeSchema,
  user_auth_provider: optionalUserAuthProvidersSchema,
});

export type PaginateUsersPayload = z.infer<typeof paginateUsersSchema>;

export class PaginateUsersDTO extends createZodDto(paginateUsersSchema) {
  @ApiPropertyOptional({ type: String, description: 'Optional user name' })
  user_name?: string;

  @ApiPropertyOptional({
    type: 'enum',
    description: 'Optional user type',
    enum: UserTypeEnum,
  })
  user_type?: UserTypeEnum;

  @ApiPropertyOptional({
    type: 'enum',
    description: 'Optional user authentication provider',
    enum: UserAuthProviders,
  })
  user_auth_provider?: UserAuthProviders;
}
