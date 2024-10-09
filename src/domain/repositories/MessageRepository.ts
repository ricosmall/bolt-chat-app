import { Message } from '../entities/Message';

export interface MessageRepository {
  saveMessage(message: Message): Promise<void>;
  getMessages(): Promise<Message[]>;
}