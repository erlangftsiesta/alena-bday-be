import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  name: string;
  username: string;
  password: string;
  bio: string;
  avatar?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}
