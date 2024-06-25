import { Controller, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';

import { ConfirmEmailDTO } from '../dtos/confirm-email.dto';
import { EmailConfirmationService } from '../services/email-confirmation.service';

@ApiTags('email-confirmation')
@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('send-verification-link')
  async sendVerificationLink(@DecodedToken() decoded_token: DecodedTokenType) {
    return this.emailConfirmationService.sendVerificationLink(decoded_token.id);
  }

  @Put('confirm-email')
  async confirmEmail(@Query() querys: ConfirmEmailDTO) {
    return this.emailConfirmationService.confirmEmail(querys);
  }
}
