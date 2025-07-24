// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

export interface CustomRequest extends Request {
  user?: any;
  logout(callback: (err: any) => void): void;
}

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: CustomRequest, @Res() res: Response) {
    const user = req.user;
    const token = jwt.sign({ sub: user.id }, 'RAHASIA_BOS', {
      expiresIn: '1d',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // true kalau HTTPS
      sameSite: 'lax',
    });

    return res.send({ message: 'Login sukses' });
  }

  @Post('logout')
  logout(@Req() req: CustomRequest, @Res() res: Response) {
    // Optional: kalau pakai passport
    req.logout(() => null);

    // Hapus cookie JWT
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false, // true kalau HTTPS
      sameSite: 'lax',
    });

    // Kalau pakai session dan mau bersihin juga:
    res.clearCookie('connect.sid', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.send({ message: 'Logged out' });
  }

  @Get('me')
  async me(@Req() req: CustomRequest) {
    console.log('User from request:', req.user);
    if (!req.user) {
      throw new UnauthorizedException();
    }

    return this.usersService.findOne(req.user.id);
  }
}
