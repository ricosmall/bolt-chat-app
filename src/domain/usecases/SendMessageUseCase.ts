import { Message } from '../entities/Message';

export interface SendMessageUseCase {
  execute(content: string): AsyncGenerator<Message, void, unknown>;
}