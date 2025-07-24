// main.ts
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret:
        process.env.SESSION_SECRET ??
        'ini_buat_the_only_one_of_mine_she_is_alen',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
      }, // false kalau belum pakai HTTPS
    }),
  );
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    origin: 'http://localhost:5173', // atau 'http://localhost:3001' kalo mau specific
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
