import { Body, Controller, Post } from "@nestjs/common";
import { PiplineService } from "./pipline.service";
import type { DomainContext, DomainResult } from "./pipline.types";

@Controller('/chatbot')
export class PiplineController {
    constructor(private readonly pipline: PiplineService) {}

    @Post('/ask')
    async ask (@Body() body: DomainContext): Promise<DomainResult> {
        return this.pipline.handleUserQuery(body.userQuestion, {
            coords: body.coords,
        })
    }
}