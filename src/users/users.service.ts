import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private UserRepository: Repository<Users>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.UserRepository.create(createUserDto);
    return this.UserRepository.save(user);
  }
  findAll() {
    return this.UserRepository.find();
  }

  async findOne(id: number) {
    const user = await this.UserRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.UserRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.UserRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.UserRepository.remove(user);
    return {
      message: `User with id ${id} has been removed successfully`,
    };
  }
}
