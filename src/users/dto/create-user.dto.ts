import { IsNotEmpty, IsDate, IsOptional, IsString } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;
  
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
