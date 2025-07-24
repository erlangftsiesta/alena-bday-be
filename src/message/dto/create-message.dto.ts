// src/message/dto/create-message.dto.ts

import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  songTitle: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  albumCover: string;

  @IsString()
  @IsNotEmpty()
  songMp3: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  sender?: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isNew: boolean;

  @IsInt()
  @IsOptional()
  userId?: number;
}
