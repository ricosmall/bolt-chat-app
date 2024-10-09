import { injectable } from 'inversify';
import { Message } from '../../domain/entities/Message';
import { MessageRepository } from '../../domain/repositories/MessageRepository';

@injectable()
export class InMemoryMessageRepository implements MessageRepository {
  private messages: Message[] = [];

  async saveMessage(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async getMessages(): Promise<Message[]> {
    return [...this.messages];
  }
}