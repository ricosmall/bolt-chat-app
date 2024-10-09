import { injectable, inject } from 'inversify';
import { SendMessageUseCase } from '../../domain/usecases/SendMessageUseCase';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { Message, MessageEntity } from '../../domain/entities/Message';
import { AIApiService } from '../../infrastructure/services/AIApiService';

@injectable()
export class SendMessageUseCaseImpl implements SendMessageUseCase {
  constructor(
    @inject('MessageRepository') private messageRepository: MessageRepository,
    @inject('AIApiService') private aiApiService: AIApiService
  ) {}

  async* execute(content: string): AsyncGenerator<Message, void, unknown> {
    const userMessageMaybe = MessageEntity.create(content, 'user');
    if (userMessageMaybe.isNothing()) {
      throw new Error('Invalid message content');
    }
    const userMessage = userMessageMaybe.extract();
    await this.messageRepository.saveMessage(userMessage);

    yield userMessage;

    let aiResponseContent = '';
    const aiMessageMaybe = MessageEntity.create('', 'ai');
    if (aiMessageMaybe.isNothing()) {
      throw new Error('Failed to create AI message entity');
    }
    let aiMessage = aiMessageMaybe.extract();

    const aiResponseStream = this.aiApiService.getAIResponseStream(content);
    for await (const chunk of aiResponseStream) {
      aiResponseContent += chunk;
      aiMessage = { ...aiMessage, content: aiResponseContent };
      yield aiMessage;
    }

    await this.messageRepository.saveMessage(aiMessage);
  }
}