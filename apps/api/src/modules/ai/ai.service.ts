import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;
  private isConfigured = false;
  private readonly model: string;
  private readonly maxTokens: number;

  private readonly providerConfig = {
    openai: {
      baseURL: 'https://api.openai.com/v1',
      defaultModel: 'gpt-4o-mini',
      envKey: 'OPENAI_API_KEY',
    },
    perplexity: {
      baseURL: 'https://api.perplexity.ai',
      defaultModel: 'llama-3.1-sonar-large-128k-online',
      envKey: 'PERPLEXITY_API_KEY',
    },
    gemini: {
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      defaultModel: 'gemini-2.5-flash',
      envKey: 'GEMINI_API_KEY',
    },
  };

  constructor(private configService: ConfigService) {
    const provider = this.configService.get<string>('AI_PROVIDER');
    this.logger.log(`[DEBUG] Raw AI_PROVIDER from env: '${provider}'`); // Debug log

    const selectedProvider = provider || 'openai';
    const config =
      this.providerConfig[selectedProvider] || this.providerConfig.openai;

    this.logger.log(`[DEBUG] Selected Provider: ${selectedProvider}`);
    this.logger.log(`[DEBUG] Config BaseURL: ${config.baseURL}`);

    const apiKey = this.configService.get<string>(config.envKey);
    this.model =
      this.configService.get<string>('AI_MODEL') || config.defaultModel;
    this.maxTokens =
      parseInt(this.configService.get<string>('AI_MAX_TOKENS') || '1000') ||
      1000;

    if (!apiKey || apiKey.startsWith('sk-your-') || apiKey === 'your-key') {
      this.logger.warn(
        `⚠️  ${selectedProvider.toUpperCase()} API key not configured. AI features will be disabled.`
      );
      this.logger.warn(
        `   Add ${config.envKey} to your .env file to enable AI features.`
      );
      this.isConfigured = false;
    } else {
      try {
        this.openai = new OpenAI({
          apiKey,
          baseURL: config.baseURL,
        });
        this.isConfigured = true;
        this.logger.log(
          `✅ AI Service initialized with provider: ${selectedProvider.toUpperCase()}`
        );
        this.logger.log(`   Model: ${this.model}`);
      } catch (error) {
        this.logger.error('Failed to initialize AI client:', error);
        this.isConfigured = false;
      }
    }
  }

  /**
   * Check if AI service is properly configured
   */
  isAvailable(): boolean {
    return this.isConfigured && this.openai !== null;
  }

  /**
   * Generic chat completion method
   */
  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<string> {
    if (!this.isAvailable()) {
      throw new BadRequestException(
        'AI service is not configured. Please contact your administrator.'
      );
    }

    try {
      const response = await this.openai!.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? this.maxTokens,
        frequency_penalty: options.frequencyPenalty ?? 0,
        presence_penalty: options.presencePenalty ?? 0,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Log token usage for cost monitoring
      this.logger.debug(
        `Token usage: ${response.usage?.total_tokens} (prompt: ${response.usage?.prompt_tokens}, completion: ${response.usage?.completion_tokens})`
      );

      return content;
    } catch (error) {
      this.logger.error('OpenAI API error:', error);
      throw new BadRequestException(
        'Failed to generate AI response. Please try again.'
      );
    }
  }

  /**
   * Generate structured output (for itineraries, etc.)
   */
  async generateStructuredOutput<T>(prompt: string, schema: any): Promise<T> {
    if (!this.isAvailable()) {
      throw new BadRequestException(
        'AI service is not configured. Please contact your administrator.'
      );
    }

    try {
      this.logger.debug(
        `[AI] Requesting structured output from model: ${this.model}`
      );

      const response = await this.openai!.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant. You MUST respond with ONLY valid JSON matching the schema requested. No markdown, no explanation, just the raw JSON object.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3, // Lower temperature for more consistent structured output
        max_tokens: this.maxTokens,
        // Note: response_format not used - Gemini may not support it
      });

      const content = response.choices[0]?.message?.content;
      this.logger.debug(
        `[AI] Raw response content: ${content?.substring(0, 200)}...`
      );

      if (!content) {
        throw new Error('No response from AI');
      }

      // Extract JSON from response - handle markdown code blocks and plain JSON
      let jsonContent = content.trim();

      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.slice(7);
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.slice(3);
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.slice(0, -3);
      }
      jsonContent = jsonContent.trim();

      this.logger.debug(
        `[AI] Cleaned JSON: ${jsonContent.substring(0, 200)}...`
      );

      return JSON.parse(jsonContent) as T;
    } catch (error) {
      this.logger.error('Failed to generate structured output:', error);
      throw new BadRequestException(
        `Failed to generate structured response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Stream chat completion (for real-time responses)
   */
  async *streamChat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncGenerator<string> {
    if (!this.isAvailable()) {
      throw new BadRequestException(
        'AI service is not configured. Please contact your administrator.'
      );
    }

    try {
      const stream = await this.openai!.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? this.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      this.logger.error('OpenAI streaming error:', error);
      throw new BadRequestException(
        'Failed to stream AI response. Please try again.'
      );
    }
  }
}
