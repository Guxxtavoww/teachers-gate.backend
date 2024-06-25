import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { EmailConfirmationService } from './services/email-confirmation.service';

@Module({
  imports: [UserModule],
  providers: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
