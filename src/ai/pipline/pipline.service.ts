import { Injectable } from '@nestjs/common';
import { IntentService } from '../intent/intent.service';
import { RegistryService } from '../registry/registry.service';
import { DomainContext, DomainResult } from './pipline.types';

@Injectable()
export class PiplineService {
  constructor(
    private readonly intentService: IntentService,
    private readonly registry: RegistryService,
  ) { }

  async handleUserQuery(
    userQuestion: string,
    baseCtx: Partial<DomainContext> = {},
  ): Promise<DomainResult> {
    const intentResult = await this.intentService.intent(userQuestion);
    const handler = this.registry.get(intentResult.intent);

    if (!handler) {
      return {
        message:
          '그건 아직 잘 모르겠어요. 날씨/버스/약국/지역화폐 관련 질문이라면 더 도와줄 수 있어요!',
      };
    }

    const ctx: DomainContext = {
      userQuestion,
      intentMeta: intentResult.meta,
      ...baseCtx,
    };

    const raw = await handler.fetch(ctx);
    const snapshot = await handler.normalize(raw, ctx);
    return await handler.answer(snapshot, ctx);
  }
}
