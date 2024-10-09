import { injectable, inject } from 'inversify';
import { GetMessagesUseCase } from '../../domain/usecases/GetMessagesUseCase';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { Message } from '../../domain/entities/Message';

@injectable()
export class GetMessagesUseCaseImpl implements GetMessagesUseCase {
  constructor(
    @inject('MessageRepository') private messageRepository: MessageRepository
  ) {}

  async execute(): Promise<Message[]> {
    return this.messageRepository.getMessages();
  }
}