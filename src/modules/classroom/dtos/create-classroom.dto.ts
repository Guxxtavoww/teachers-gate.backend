import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema } from 'src/shared/schemas.shared';

export const createClassroomSchema = z.object({
  classroom_name: stringSchema,
  classroom_description: stringSchema,
});

export type CreateClassroomPayload = z.infer<typeof createClassroomSchema>;

export class CreateClassroomDTO extends createZodDto(createClassroomSchema) {
  @ApiProperty({ type: String })
  classroom_name: string;

  @ApiProperty({ type: String })
  classroom_description: string;
}
