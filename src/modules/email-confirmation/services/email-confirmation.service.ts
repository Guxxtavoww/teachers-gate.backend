import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ENV_VARIABLES } from 'src/config/env.config';
import { MailService } from 'src/lib/mail/services/mail.service';
import { UserService } from 'src/modules/user/services/user.service';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { parsedTokenSchema } from '../dtos/parsed-token.dto';
import type { ConfirmEmailPayload } from '../dtos/confirm-email.dto';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async sendVerificationLink(user_id: string) {
    const { user_email, is_email_verified } =
      await this.userService.getUserById(user_id);

    if (is_email_verified) return;

    const token = await this.jwtService.signAsync(
      { user_email },
      {
        secret: ENV_VARIABLES.JWT_SECRET,
        expiresIn: '2h',
      },
    );

    if (ENV_VARIABLES.ENV !== 'prod') Logger.log({ token });

    const url = new URL(ENV_VARIABLES.EMAIL_CONFIRMATION_URL);

    url.searchParams.set('token', token);

    const message = `To confirm your email click here: ${url.href}`;

    return this.mailService.sendEmail({
      to: user_email,
      message,
      subject: 'Email Confirmation',
    });
  }

  async confirmEmail(payload: ConfirmEmailPayload, logged_in_user_id: string) {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(payload.token, {
        secret: ENV_VARIABLES.JWT_SECRET,
      });

      const parsedToken = await parsedTokenSchema.parseAsync(verifiedToken);

      return this.userService.markEmailAsConfirmed(
        parsedToken.user_email,
        logged_in_user_id,
      );
    } catch (err) {
      throw new BadRequestError('Invalid Token');
    }
  }
}
