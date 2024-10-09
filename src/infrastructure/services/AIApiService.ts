import { injectable } from 'inversify';

@injectable()
export class AIApiService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.apiUrl = 'https://free.gpt.ge/v1/chat/completions';
  }

  async* getAIResponseStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.apiKey) {
      console.error('OpenAI API key is not set');
      yield 'I apologize, but I am unable to process your request at the moment.';
      return;
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error('Error calling OpenAI API:', response.statusText);
      yield 'I apologize, but I encountered an error while processing your request. Please try again later.';
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, '').trim())
        .filter((line) => line !== '' && line !== '[DONE]')
        .map((line) => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          yield content;
        }
      }
    }
  }
}