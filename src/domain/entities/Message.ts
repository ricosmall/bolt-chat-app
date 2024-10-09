import { Maybe } from 'purify-ts/Maybe';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export class MessageEntity implements Message {
  constructor(
    public id: string,
    public content: string,
    public sender: 'user' | 'ai',
    public timestamp: Date
  ) {}

  static create(content: string, sender: 'user' | 'ai'): Maybe<MessageEntity> {
    return Maybe.of(new MessageEntity(
      Date.now().toString(),
      content,
      sender,
      new Date()
    ));
  }
}