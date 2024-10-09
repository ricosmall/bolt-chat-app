import { Container } from 'inversify';
import 'reflect-metadata';
import { MessageRepository } from '../../domain/repositories/MessageRepository';
import { InMemoryMessageRepository } from '../../data/repositories/InMemoryMessageRepository';
import { SendMessageUseCase } from '../../domain/usecases/SendMessageUseCase';
import { SendMessageUseCaseImpl } from '../../data/usecases/SendMessageUseCaseImpl';
import { GetMessagesUseCase } from '../../domain/usecases/GetMessagesUseCase';
import { GetMessagesUseCaseImpl } from '../../data/usecases/GetMessagesUseCaseImpl';
import { AIApiService } from '../services/AIApiService';

const container = new Container();

container.bind<MessageRepository>('MessageRepository').to(InMemoryMessageRepository).inSingletonScope();
container.bind<SendMessageUseCase>('SendMessageUseCase').to(SendMessageUseCaseImpl);
container.bind<GetMessagesUseCase>('GetMessagesUseCase').to(GetMessagesUseCaseImpl);
container.bind<AIApiService>('AIApiService').to(AIApiService).inSingletonScope();

export { container };