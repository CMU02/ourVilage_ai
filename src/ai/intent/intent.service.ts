import { Injectable } from '@nestjs/common';
import { intentSystemPrompt, intentSystemPromptV2 } from '../prompt/ai.prompt';
import { safeParseJson } from '../utils/safe_parse_json';
import { isIntentLabel } from '../utils/is_intent_label';
import OpenAI from 'openai';
import { IntentResult } from './intent.types';

@Injectable()
export class IntentService {
  private client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async intent(userQuestion: string): Promise<IntentResult> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: intentSystemPrompt },
        { role: 'user', content: userQuestion },
      ],
      temperature: 0.0,
    });

    const raw = completion.choices[0].message.content?.trim() ?? '';
    const parsed = safeParseJson<Partial<IntentResult>>(raw) ?? {};

    const intent = isIntentLabel(parsed.intent) ? parsed.intent : '기타';
    const metadata =
      parsed.meta &&
        typeof parsed.meta === 'object' &&
        !Array.isArray(parsed.meta)
        ? parsed.meta
        : {};

    console.log(intent, metadata);

    return { intent, meta: metadata };
  }
}
