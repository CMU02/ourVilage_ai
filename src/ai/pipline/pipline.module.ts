import { Module } from "@nestjs/common";
import { IntentModule } from "../intent/intent.module";
import { RegistryModule } from "../registry/registry.module";
import { HandlerModule } from "../handler/handler.module";
import { PiplineController } from "./pipline.controller";
import { PiplineService } from "./pipline.service";

@Module({
    imports: [IntentModule, RegistryModule, HandlerModule],
    controllers: [PiplineController],
    providers: [PiplineService],
    exports: [PiplineService]
})

export class PiplineModule {};