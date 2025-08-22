import { Injectable } from "@nestjs/common";
import { IntentLabel } from "../intent/intent.types";
import { DomainHandler } from "../handler/handler.types";

@Injectable()
export class RegistryService {
    private readonly map = new Map<IntentLabel, DomainHandler>();

    register(intent: IntentLabel, handler: DomainHandler) {
        this.map.set(intent, handler);
    }

    get(intent: IntentLabel): DomainHandler | undefined {
        return this.map.get(intent)
    }

    getAllRegistered(): string[] {
        return Array.from(this.map.keys());
    }
}