import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomsSchema = createPaginationSchema({
  classroom_name: optionalStringSchema.transform((name) =>
    name?.toLocaleLowerCase(),
  ),
  teacher_id: optionalUuidSchema,
});

export type PaginateClassroomsPayload = z.infer<
  typeof paginateClassroomsSchema
>;

export class PaginateClassroomsDTO extends createZodDto(
  paginateClassroomsSchema,
) {
  @ApiPropertyOptional({ type: String, description: 'Classroom name' })
  classroom_name?: string;

  @ApiPropertyOptional({ type: String, description: 'The teacher id' })
  teacher_id?: string;
}
