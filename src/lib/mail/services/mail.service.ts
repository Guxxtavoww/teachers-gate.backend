import {
  Inject,
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resend } from 'resend';

import { ENV_VARIABLES } from 'src/config/env.config';

import { SendEmailDTO } from '../dtos/send-email.dto';

@Injectable()
export class MailService {
  constructor(@Inject('Resend') private readonly resend: Resend) {}

  async sendEmail(payload: SendEmailDTO): Promise<string | undefined> {
    const htmlContent = this.generateEmailHtml(payload.message);

    Logger.log(payload.to);

    const isProd = ENV_VARIABLES.ENV === 'prod';

    const { data, error } = await this.resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      subject: payload.subject,
      to: isProd ? 'gustavoaugustocarcontato@gmail.com' : payload.to,
      reply_to: ENV_VARIABLES.EMAIL_FROM,
      html: htmlContent,
    });

    if (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.message);
    }

    return data?.id;
  }

  private generateEmailHtml(message: string): string {
    return `
        <h1>Hello From Teacher's Gate, we have a message for you:</h1>
        <p>${message}</p>
      `;
  }
}
