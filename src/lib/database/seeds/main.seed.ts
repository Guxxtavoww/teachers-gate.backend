/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import {
  type Seeder,
  SeederFactoryManager,
  runSeeder,
} from 'typeorm-extension';

export class MainSeeder implements Seeder {
  track?: boolean | undefined;
  async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {}
}
