import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Currencies } from 'src/util/utils';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Wallet) private readonly userSevice: UserService,
  ) {}

  findAll() {
    return `This action returns all wallet`;
  }

  async findOne(id: number): Promise<Wallet> {
    return this.walletRepository.findOne({ where: { id } });
  }

  async debitWallet(wallet: Wallet, amount: number) {
    const balance = +wallet.balance - +amount;
    return this.walletRepository.update(wallet.id, { balance });
  }

  async creditWallet(wallet: Wallet, amount: number) {
    const balance = +wallet.balance + +amount;
    return this.walletRepository.update(wallet.id, { balance });

  }

  async findByUserAndCurrency(
    userId: number,
    currency: Currencies,
  ): Promise<Wallet> {
    return this.walletRepository.findOne({
      where: {
        currency,
        user: { id: userId },
      },
      relations: ['user'],
    });
  }

  async update(id: number, amount: number) {
    const wallet = await this.findOne(id);
    if (!wallet) {
      throw new HttpException('Invalid wallet', HttpStatus.BAD_REQUEST);
    }
    wallet.balance = +wallet.balance + +amount;
    return this.walletRepository.save(wallet);
  }
}
