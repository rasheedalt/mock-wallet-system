import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  CONVERSION_RATES,
  Currencies,
  generateRandomString,
  TRANFER_WITHOUT_APPROVAL_LIMIT,
  TransactionStatuses,
  TransactionTypes,
} from 'src/util/utils';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly walletService: WalletService,
  ) {}

  allTransactions(){
    return this.transactionRepository.find();
  }

  async creditWallet(
    user: User,
    currency: Currencies,
    amount: number,
    wallet: Wallet,
  ) {
    try {
        // TODO:: integrate paystack to collect payment before logging the transaction

      const transaction = new Transaction();
      transaction.amount = amount;
      transaction.reference = generateRandomString();
      transaction.toCurrency = currency;
      transaction.fromCurrency = currency;
      transaction.status = TransactionStatuses.SUCCESS;
      transaction.user = user;
      transaction.type = TransactionTypes.CREDIT;

      this.walletService.creditWallet(wallet, amount);
      this.transactionRepository.save(transaction);
    } catch (e) {
      console.log(e);
    }
  }

  async tranfer(
    user: User,
    originWallet: Wallet,
    destinationWallet: Wallet,
    amount: number,
  ) {
    const fromCurrency = originWallet.currency;
    const toCurrency = destinationWallet.currency;
    const rate: number = CONVERSION_RATES[fromCurrency][toCurrency];

    const isApprovalRequired = +amount >= TRANFER_WITHOUT_APPROVAL_LIMIT;

    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.reference = generateRandomString();
    transaction.fromCurrency = fromCurrency;
    transaction.toCurrency = toCurrency;
    transaction.status = isApprovalRequired
      ? TransactionStatuses.PENDING_APPROVAL
      : TransactionStatuses.SUCCESS;
    transaction.user = user;
    transaction.rate = rate;
    transaction.type = TransactionTypes.TRANSFER;

    this.walletService.debitWallet(originWallet, +amount);
    this.walletService.creditWallet(destinationWallet, +amount * rate);
    this.transactionRepository.save(transaction);
  }
}
