import { type ZodRawShape, z } from 'nestjs-zod/z';

import { optionalOrderParamSchema, optionalPaginationParamSchema } from 'src/shared/schemas.shared';

export function createPaginationSchema<T extends ZodRawShape>(fields: T) {
  const paginationSchema = z.object({
    page: optionalPaginationParamSchema,
    limit: optionalPaginationParamSchema,
    order_by_created_at: optionalOrderParamSchema,
    order_by_updated_at: optionalOrderParamSchema,
    ...fields,
  });

  return paginationSchema;
}
