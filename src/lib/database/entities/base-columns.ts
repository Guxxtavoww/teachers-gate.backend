import type { TableColumnOptions } from 'typeorm';

export const baseColumns = [
  {
    name: 'id',
    type: 'uuid',
    generationStrategy: 'uuid',
    isPrimary: true,
    default: 'uuid_generate_v4()',
  },
  {
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'updated_at',
    type: 'timestamp',
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP',
  },
] satisfies TableColumnOptions[];
