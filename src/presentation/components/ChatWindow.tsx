import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInjection } from '../hooks/useInjection';
import { SendMessageUseCase } from '../../domain/usecases/SendMessageUseCase';
import { GetMessagesUseCase } from '../../domain/usecases/GetMessagesUseCase';
import { Message, MessageEntity } from '../../domain/entities/Message';
import { Send } from 'lucide-react';
import MessageDisplay from './MessageDisplay';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageUseCase = useInjection<SendMessageUseCase>('SendMessageUseCase');
  const getMessagesUseCase = useInjection<GetMessagesUseCase>('GetMessagesUseCase');

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const loadedMessages = await getMessagesUseCase.execute();
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateMessages = useCallback((newMessage: Message) => {
    setMessages(prevMessages => {
      const existingMessageIndex = prevMessages.findIndex(m => m.id === newMessage.id);
      if (existingMessageIndex === -1) {
        return [...prevMessages, newMessage];
      } else {
        return prevMessages.map(m => m.id === newMessage.id ? newMessage : m);
      }
    });
  }, []);

  const processMessageStream = useCallback(async (messageStream: AsyncGenerator<Message, void, unknown>) => {
    for await (const message of messageStream) {
      if (message.sender === 'ai') {
        updateMessages(message);
      }
    }
  }, [updateMessages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessageMaybe = MessageEntity.create(input.trim(), 'user');
      if (userMessageMaybe.isNothing()) {
        console.error('Failed to create user message');
        setIsLoading(false);
        return;
      }
      const userMessage = userMessageMaybe.extract();
      updateMessages(userMessage);
      setInput('');

      try {
        const messageStream = sendMessageUseCase.execute(userMessage.content);
        await processMessageStream(messageStream);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessageMaybe = MessageEntity.create('An error occurred. Please try again.', 'ai');
        if (errorMessageMaybe.isJust()) {
          updateMessages(errorMessageMaybe.extract());
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageDisplay key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;