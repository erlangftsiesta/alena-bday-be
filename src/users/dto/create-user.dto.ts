import { IsNotEmpty, IsDate } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
