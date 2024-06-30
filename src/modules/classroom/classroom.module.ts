import { Global, Module } from '@nestjs/common';

import { ClassroomService } from './services/classroom.service';
import { ClassroomController } from './controllers/classroom.controller';

@Global()
@Module({
  providers: [ClassroomService],
  exports: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
