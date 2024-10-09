import { Message } from '../entities/Message';

export interface GetMessagesUseCase {
  execute(): Promise<Message[]>;
}