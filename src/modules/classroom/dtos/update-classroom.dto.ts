import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { optionalStringSchema } from 'src/shared/schemas.shared';

export const updateClassroomSchema = z.object({
  classroom_name: optionalStringSchema,
  classroom_description: optionalStringSchema,
});

export type UpdateClassroomPayload = z.infer<typeof updateClassroomSchema>;

export class UpdateClassroomDTO extends createZodDto(updateClassroomSchema) {
  @ApiProperty({ type: String, required: false })
  classroom_name?: string;

  @ApiProperty({ type: String, required: false })
  classroom_description?: string;
}
