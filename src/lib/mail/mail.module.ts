import { Resend } from 'resend';
import { Global, Module } from '@nestjs/common';

import { ENV_VARIABLES } from 'src/config/env.config';

import { MailService } from './services/mail.service';

@Global()
@Module({
  providers: [
    MailService,
    {
      provide: 'Resend',
      useValue: new Resend(ENV_VARIABLES.RESEND_API_KEY),
    },
  ],
  exports: [MailService],
})
export class MailModule {}
