// src/message/message.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('new-message')
  create(@Body() dto: CreateMessageDto) {
    return this.messageService.create(dto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get('public-messages')
  findAllisPublic() {
    return this.messageService.findAllisPublic();
  }
  @Get('private-messages')
  findAllisPrivate() {
    return this.messageService.findAllisPrivate();
  }

  @Patch('mark-all-read')
  async markAllAsRead() {
    await this.messageService.markAllAsRead();
    return { success: true };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMessageDto) {
    return this.messageService.update(id, dto);
  }

  @Patch(':id/privacy-update')
  async updatePrivacy(
    @Param('id') id: number,
    @Body('isPublic') isPublic: boolean,
  ) {
    const result = await this.messageService.updatePrivacy(id, isPublic);
    if (!result) {
      throw new NotFoundException('Message not found');
    }
    return { success: true };
  }

  @Patch(':id/mark-read')
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    const result = await this.messageService.markAsRead(id);
    if (!result) {
      throw new NotFoundException('Message not found');
    }
    return { success: true };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.remove(id);
  }
}
