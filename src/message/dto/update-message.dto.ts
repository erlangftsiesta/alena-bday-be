import { CreateMessageDto } from "./create-message.dto";

export class UpdateMessageDto implements Partial<CreateMessageDto> {
  songTitle?: string;
  artist?: string;
  albumCover?: string;
  songMp3?: string;
  message?: string;
  sender?: string;
  date?: string;
  isPublic?: boolean;
  isNew?: boolean;
  userId?: number; // Optional, to update the user associated with the message
}