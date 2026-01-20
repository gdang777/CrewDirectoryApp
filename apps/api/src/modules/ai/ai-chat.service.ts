import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);
  // Store conversation history in memory (in production, use Redis or database)
  private conversations = new Map<string, ChatMessage[]>();

  constructor(
    private aiService: AiService,
    private promptService: PromptService
  ) {}

  /**
   * Handle AI chat message with context
   */
  async handleChatMessage(
    userId: string,
    cityCode: string,
    message: string
  ): Promise<string> {
    if (!this.aiService.isAvailable()) {
      return 'Sorry, AI features are currently unavailable. Please make sure the OpenAI API key is configured.';
    }

    try {
      // Get or create conversation history
      const conversationKey = `${userId}-${cityCode}`;
      let history = this.conversations.get(conversationKey) || [];

      // Limit history to last 10 messages to manage token usage
      if (history.length > 20) {
        history = history.slice(-20);
      }

      // Build system prompt with city context
      const systemPrompt =
        await this.promptService.buildConciergePrompt(cityCode);

      // Prepare messages for AI
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: message },
      ];

      // Get AI response
      const response = await this.aiService.chat(messages, {
        temperature: 0.7,
        maxTokens: 500,
      });

      // Update conversation history
      history.push({ role: 'user', content: message });
      history.push({ role: 'assistant', content: response });
      this.conversations.set(conversationKey, history);

      return response;
    } catch (error) {
      this.logger.error('AI chat error:', error);
      return "I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }

  /**
   * Clear conversation history for a user
   */
  clearHistory(userId: string, cityCode: string): void {
    const conversationKey = `${userId}-${cityCode}`;
    this.conversations.delete(conversationKey);
  }

  /**
   * Get conversation history
   */
  getHistory(userId: string, cityCode: string): ChatMessage[] {
    const conversationKey = `${userId}-${cityCode}`;
    return this.conversations.get(conversationKey) || [];
  }
}
