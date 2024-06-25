import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

import {
  optionalStringSchema,
  optionalEmailStringSchema,
} from 'src/shared/schemas.shared';

import { optionalUserTypeSchema } from './user-type.schema';

export const updateUserSchema = z.object({
  user_name: optionalStringSchema,
  user_email: optionalEmailStringSchema,
  user_type: optionalUserTypeSchema,
  new_password: optionalStringSchema,
  previous_password: optionalStringSchema,
});

export type UpdateUserPayload = z.infer<typeof updateUserSchema>;

export class UpdateUserDTO extends createZodDto(updateUserSchema) {}
