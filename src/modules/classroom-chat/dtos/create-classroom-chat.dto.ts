import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';

import { stringSchema, uuidSchema } from 'src/shared/schemas.shared';

export const createClassroomChatSchema = z.object({
  chat_name: stringSchema,
  chat_description: stringSchema,
  classroom_id: uuidSchema,
});

export type CreateClassroomChatPayload = z.infer<
  typeof createClassroomChatSchema
>;

export class CreateClassroomChatDTO extends createZodDto(
  createClassroomChatSchema,
) {
  @ApiProperty({ type: String, description: 'Chat Name' })
  chat_name: string;

  @ApiProperty({
    type: String,
    description: 'Description',
    example: 'Example Desc',
  })
  chat_description: string;

  @ApiProperty({
    type: String,
    example: 'insert_valid_uuid_here',
  })
  classroom_id: string;
}
