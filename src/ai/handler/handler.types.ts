import { DomainContext, DomainResult } from "../pipline/pipline.types";

export interface DomainHandler {
    fetch(ctx: DomainContext): Promise<unknown>;
    normalize(raw: unknown, ctx: DomainContext): Promise<Record<string, unknown>>;
    answer(snapshot: Record<string, any>, ctx: DomainContext): Promise<DomainResult>;
}