// src/message/message.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Users } from 'src/users/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const user = dto.userId
      ? await this.userRepo.findOneBy({ id: dto.userId })
      : null;

    const message = this.messageRepo.create({
      ...dto,
      sender: dto.sender?.trim() || 'Anonymous',
      ...(user && { user }), // hanya tambahkan user jika ada
    });

    return this.messageRepo.save(message);
  }

  async findAll(): Promise<any[]> {
    const messages = await this.messageRepo.find({ relations: ['user'] });
    return messages.map((msg) => ({
      id: msg.id,
      songTitle: msg.songTitle,
      artist: msg.artist,
      albumCover: msg.albumCover,
      songMp3: msg.songMp3,
      message: msg.message,
      sender: msg.sender,
      date: msg.date,
      isPublic: msg.isPublic,
      isNew: msg.isNew,
    }));
  }

  async findAllisPublic(): Promise<any[]> {
    const messages = await this.messageRepo.find({
      where: { isPublic: true },
      relations: ['user'],
      order: { date: 'DESC' },
    });

    return messages.map((msg) => ({
      id: msg.id,
      songTitle: msg.songTitle,
      artist: msg.artist,
      albumCover: msg.albumCover,
      songMp3: msg.songMp3,
      message: msg.message,
      sender: msg.sender,
      date: msg.date,
      isPublic: msg.isPublic,
    }));
  }

  async findAllisPrivate(): Promise<any[]> {
    const messages = await this.messageRepo.find({
      where: { isPublic: false },
      relations: ['user'],
      order: { date: 'DESC' },
    });

    return messages.map((msg) => ({
      id: msg.id,
      songTitle: msg.songTitle,
      artist: msg.artist,
      albumCover: msg.albumCover,
      songMp3: msg.songMp3,
      message: msg.message,
      sender: msg.sender,
      date: msg.date,
      isPublic: msg.isPublic,
    }));
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: number, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException('User not found');
      message.user = user;
    }

    Object.assign(message, {
      ...dto,
      sender: dto.sender?.trim() ?? message.sender,
    });

    return this.messageRepo.save(message);
  }

  async updatePrivacy(messageId: number, isPublic: boolean): Promise<boolean> {
    const message = await this.messageRepo.findOne({
      where: { id: messageId },
    });
    if (!message) return false;

    message.isPublic = isPublic;
    await this.messageRepo.save(message);

    return true;
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepo.remove(message);
  }

  // Tandai satu pesan sebagai dibaca
  async markAsRead(id: number): Promise<boolean> {
    const result = await this.messageRepo.update({ id }, { isNew: false });

    return result!.affected! > 0;
  }

  // Tandai semua pesan sebagai dibaca
  async markAllAsRead(): Promise<void> {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ isNew: false })
      .where('isNew = :isNew', { isNew: true })
      .execute();
  }
}
