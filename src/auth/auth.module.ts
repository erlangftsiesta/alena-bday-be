// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from './authenticated.guard';

class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: CallableFunction) {
    done(null, user.id);
  }

  async deserializeUser(id: number, done: CallableFunction) {
    const user = await this.usersService.findOne(id);
    if (user) done(null, user);
    else done(null, null);
  }
}

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer, AuthenticatedGuard],
})
export class AuthModule {}
