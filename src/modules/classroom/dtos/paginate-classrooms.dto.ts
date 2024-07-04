import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  optionalOrderParamSchema,
  optionalStringSchema,
  optionalUuidSchema,
} from 'src/shared/schemas.shared';
import { OrderByEnum } from 'src/shared/enums.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomsSchema = createPaginationSchema({
  classroom_name: optionalStringSchema.transform((name) =>
    name?.toLocaleLowerCase(),
  ),
  teacher_id: optionalUuidSchema,
  order_by_most_members: optionalOrderParamSchema,
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

  @ApiPropertyOptional({
    type: 'enum',
    description: 'Order By Most Liked',
    required: false,
    name: 'order_by_most_members',
    enum: OrderByEnum,
  })
  order_by_most_members?: 'ASC' | 'DESC';
}
