import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

import { ENV_VARIABLES } from 'src/config/env.config';
import { Public } from 'src/shared/decorators/auth.decorator';
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { LoginDTO } from '../dtos/login.dto';
import { AccessDTO } from '../dtos/access.dto';
import { RegisterDTO } from '../dtos/register.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAccessTokenCookie(dto: AccessDTO, res: Response) {
    res.cookie('access_token', dto.access_token, {
      httpOnly: true,
      secure: ENV_VARIABLES.ENV === 'prod',
      sameSite: 'strict',
    });

    return res.send(dto) as unknown as AccessDTO;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: LoginDTO,
    @Res() res: Response,
  ): Promise<AccessDTO> {
    const accessDTO = await this.authService.signIn(signInDto);

    return this.setAccessTokenCookie(accessDTO, res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @DataBaseInterceptorDecorator()
  @Post('register')
  async registerAndLogin(
    @Body() registerDTO: RegisterDTO,
    @Res() res: Response,
  ): Promise<AccessDTO> {
    const accessDTO = await this.authService.registerAndLogin(registerDTO);

    return this.setAccessTokenCookie(accessDTO, res);
  }
}
