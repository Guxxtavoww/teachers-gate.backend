import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalStringSchema,
  optionalEmailStringSchema,
} from 'src/shared/schemas.shared';

import { optionalUserTypeSchema } from './user-type.schema';
import { UserTypeEnum } from '../enums/user-type.enum';

export const updateUserSchema = z.object({
  user_name: optionalStringSchema,
  user_email: optionalEmailStringSchema,
  user_type: optionalUserTypeSchema,
  new_password: optionalStringSchema,
  previous_password: optionalStringSchema,
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

export class UpdateUserDTO extends createZodDto(updateUserSchema) {
  @ApiPropertyOptional({ type: String, description: 'Optional user name' })
  user_name?: string;

  @ApiPropertyOptional({ type: String, description: 'Optional user email' })
  user_email?: string;

  @ApiPropertyOptional({ type: 'enum', enum: UserTypeEnum })
  user_type?: UserTypeEnum;

  @ApiPropertyOptional({ type: String, description: 'Optional new password' })
  new_password?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Optional previous password',
  })
  previous_password?: string;
}
