import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { EmailConfirmationController } from './controllers/email-confirmation.controller';

@Module({
  imports: [UserModule, JwtModule],
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
