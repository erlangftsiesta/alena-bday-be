// src/message/entities/message.entity.ts

import { Users } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  songTitle: string;

  @Column({ type: 'varchar', length: 255 })
  artist: string;

  @Column({ type: 'varchar', length: 255 })
  albumCover: string;

  @Column({ type: 'varchar', length: 255 })
  songMp3: string;

  @Column({ type: 'varchar', length: 1000 })
  message: string;

  @Column({ type: 'varchar', length: 255, default: 'Anonymous' })
  sender: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'tinyint', width: 1, default: 0})
  isPublic: boolean;

  @Column({ type: 'tinyint', width: 1, default: 1}  )
  isNew: boolean;

  // Relasi satu arah ke User (tanpa field `messages` di User)
  @ManyToOne(() => Users, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' }) // opsional: nama kolom foreign key
  user: Users;
}
