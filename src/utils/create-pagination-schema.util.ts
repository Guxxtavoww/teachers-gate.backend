import { type ZodRawShape, z } from 'nestjs-zod/z';

import {
  optionalOrderParamSchema,
  optionalPaginationParamSchema,
} from 'src/shared/schemas.shared';

export function createPaginationSchema<T extends ZodRawShape>(fields: T) {
  const paginationSchema = z.object({
    page: optionalPaginationParamSchema.default(1),
    limit: optionalPaginationParamSchema.default(10),
    order_by_created_at: optionalOrderParamSchema,
    order_by_updated_at: optionalOrderParamSchema,
    ...fields,
  });

  return paginationSchema;
}
