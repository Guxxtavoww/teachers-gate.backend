import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { optionalStringSchema } from 'src/shared/schemas.shared';

export const updateClassroomChatSchema = z.object({
  chat_name: optionalStringSchema,
  chat_description: optionalStringSchema,
});

export type UpdateClassroomChatPayload = z.infer<
  typeof updateClassroomChatSchema
>;

export class UpdateClassroomChatDTO extends createZodDto(
  updateClassroomChatSchema,
) {
  @ApiProperty({ type: String, description: 'Chat Name' })
  chat_name?: string;

  @ApiProperty({
    type: String,
    description: 'Description',
    example: 'Example Desc',
  })
  chat_description?: string;
}
