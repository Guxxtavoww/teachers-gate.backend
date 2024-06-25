import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  emailStringSchema,
  optionalStringSchema,
  stringSchema,
} from 'src/shared/schemas.shared';

import { userTypeSchema } from './user-type.schema';
import { UserAuthProviders } from '../enums/user-auth-providers.enum';
import { userAuthProvidersSchema } from './user-auth-providers.schema';
import { UserTypeEnum } from '../enums/user-type.enum';

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

export class CreateUserDTO extends createZodDto(createUserSchema) {
  @ApiProperty({ type: String, description: 'User name' })
  user_name: string;

  @ApiProperty({ type: String, description: 'User email' })
  user_email: string;

  @ApiProperty({
    type: 'enum',
    description: 'User type',
    enum: UserTypeEnum,
    example: UserTypeEnum.STUDENT,
  })
  user_type: UserTypeEnum;

  @ApiPropertyOptional({ type: String, description: 'Optional password' })
  password?: string;

  @ApiProperty({
    enum: UserAuthProviders,
    description: 'User authentication provider',
    default: UserAuthProviders.EMAIL,
  })
  user_auth_provider: UserAuthProviders;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Email verification status',
  })
  is_email_verified?: boolean;
}
