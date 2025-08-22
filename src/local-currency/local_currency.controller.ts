import { Body, Controller, Post } from "@nestjs/common";
import { LocalCurrencyService } from "./local_currency.service";
import type { ParsedLocalCurrencyData, RequestLocalCurreny } from "./local_currency.types";

@Controller('/local-currency')
export class LocalCurrenyController {
    constructor(private readonly localCurrencyService: LocalCurrencyService) { }

    @Post('/search')
    async getLocalCurrencyList(@Body() { ...props }: RequestLocalCurreny): Promise<ParsedLocalCurrencyData> {
        return await this.localCurrencyService.getLocalCurrencyStores(props);
    }
}