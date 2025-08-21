import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalCurrencyService {
    constructor(private readonly httpService: HttpService) {}

    
}