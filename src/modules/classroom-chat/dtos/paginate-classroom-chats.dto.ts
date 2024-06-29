import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomChatsSchema = createPaginationSchema({
  chat_name: optionalStringSchema.transform((value) =>
    value?.toLocaleLowerCase(),
  ),
  chat_description: optionalStringSchema.transform((value) =>
    value?.toLocaleLowerCase(),
  ),
  classroom_id: optionalUuidSchema,
});

export type PaginateClassroomChatsPayload = z.infer<
  typeof paginateClassroomChatsSchema
>;

export class PaginateClassroomChatsDTO extends createZodDto(
  paginateClassroomChatsSchema,
) {
  @ApiPropertyOptional({ type: String, description: 'Chat Name' })
  chat_name?: string;

  @ApiPropertyOptional({ type: String, description: 'Chat Description' })
  chat_description?: string;

  @ApiPropertyOptional({ type: String, description: 'Classroom id' })
  classroom_id?: string;
}
