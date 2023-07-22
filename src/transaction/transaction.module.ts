import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    WalletModule,
    TypeOrmModule.forFeature([Transaction])
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService]
})
export class TransactionModule {}
