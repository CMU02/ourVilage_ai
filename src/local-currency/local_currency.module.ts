import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { LocalCurrencyService } from "./local_currency.service";
import { LocalCurrenyController } from "./local_currency.controller";

@Module({
    providers: [LocalCurrencyService],
    controllers: [LocalCurrenyController],
    exports: [LocalCurrencyService],
    imports: [HttpModule]
})

export class LocalCurrencyModule {}