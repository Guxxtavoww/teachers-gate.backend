import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { optionalUuidSchema } from 'src/shared/schemas.shared';
import { createPaginationSchema } from 'src/utils/create-pagination-schema.util';

export const paginateClassroomMembersSchema = createPaginationSchema({
  classroom_id: optionalUuidSchema,
  user_id: optionalUuidSchema,
}).refine(
  (data) => {
    if (!data.classroom_id && !data.user_id) return false;

    return true;
  },
  { message: 'Provide a classroom id or a user id' },
);

export type PaginateClassroomMembersPayload = z.infer<
  typeof paginateClassroomMembersSchema
>;

export class PaginateClassroomMembersDTO extends createZodDto(
  paginateClassroomMembersSchema,
) {
  @ApiPropertyOptional({ type: String })
  classroom_id: string;

  @ApiPropertyOptional({ type: String })
  user_id: string;
}
