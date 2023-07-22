import { Controller, Get } from '@nestjs/common';
import { Response } from 'src/util/utils';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    async findAll(){
        const data = await this.transactionService.allTransactions()
        return new Response(true, data)
    }


}
