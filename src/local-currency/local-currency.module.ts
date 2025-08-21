import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
    providers: [],
    controllers: [],
    exports: [],
    imports: [HttpModule]
})

export class LocalCurrencyModule {}