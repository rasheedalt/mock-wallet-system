import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Currencies } from 'src/util/utils';
import { TransactionService } from 'src/transaction/transaction.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();

    const salt = 5;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.phoneNumber = createUserDto.phoneNumber;
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['wallets'],
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber } });
  }

  async addUserWallet(id: number, currency: Currencies): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }

    const walletExist = await this.walletService.findByUserAndCurrency(
      user.id,
      currency,
    );

    if (walletExist) {
      throw new HttpException(
        `${currency} wallet already exist for user`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newWallet = new Wallet();
    newWallet.currency = currency;

    const otherWallets = user.wallets ? user.wallets : [];
    user.wallets = [...otherWallets, newWallet];

    return this.userRepository.save(user);
  }

  async topUpWallet(
    userId: number,
    currency: Currencies,
    amount: number,
  ): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }

    if (!user.wallets) {
      throw new HttpException(
        `${currency} wallet does noot exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const wallet = await this.walletService.findByUserAndCurrency(
      user.id,
      currency,
    );

    if (!wallet) {
      throw new HttpException(
        `${currency} wallet does noot exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.transactionService.creditWallet(user, currency, amount, wallet);
    return await this.findOne(userId);
  }

  async transferToWallet(
    userId: number,
    fromCurrency: Currencies,
    toCurrency: Currencies,
    amount: number,
  ): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new HttpException('Invalid user', HttpStatus.BAD_REQUEST);
    }

    if (!user.wallets) {
      throw new HttpException(
        `${toCurrency} or ${fromCurrency} wallet does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const originWallet = await this.walletService.findByUserAndCurrency(
      user.id,
      fromCurrency,
    );
    const destinationWallet = await this.walletService.findByUserAndCurrency(
      user.id,
      toCurrency,
    );

    if (!originWallet) {
      throw new HttpException(
        `${fromCurrency} walletx does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!destinationWallet) {
      throw new HttpException(
        `${toCurrency} walletx does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (+originWallet.balance < +amount) {
      throw new HttpException(
        `insufficient balance in ${fromCurrency} wallet for transfer`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // const updated = await this.walletService.update(wallet[0].id, amount);
    // console.log(updated);
    await this.transactionService.tranfer(
      user,
      originWallet,
      destinationWallet,
      amount,
    );

    return await this.findOne(userId);
  }
}
