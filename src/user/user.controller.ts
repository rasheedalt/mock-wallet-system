// eslint-disable-next-line prettier/prettier
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import JwtGuard from 'src/auth/jwt.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletTopupDto } from './dto/wallet-topup.dto';
import { User } from './entities/user.entity';
import { Response } from 'src/util/utils';
import { WalletTransferDto } from './dto/wallet-transfer.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      data: this.userService.create(createUserDto),
    };
  }

  @Get(':id')
  // @UseGuards(JwtGuard)
  async findOne(@Param('id') id: string): Promise<Response<User>> {
    const user: User = await this.userService.findOne(+id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return new Response(true, user);
  }

  @Post(':id/create-wallet')
  // @UseGuards(JwtGuard)
  async creatWallet(
    @Param('id') id: string,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<Response<User>> {
    const response = await this.userService.addUserWallet(
      +id,
      createWalletDto.currency,
    );
    return new Response(true, response);
  }

  @Post(':id/credit-wallet')
  // @UseGuards(JwtGuard)
  topupWallet(@Param('id') id: string, @Body() walletTopupDto: WalletTopupDto) {
    return this.userService.topUpWallet(
      +id,
      walletTopupDto.currency,
      walletTopupDto.amount,
    );
  }

  @Post(':id/transfer')
  // @UseGuards(JwtGuard)
  transfer(
    @Param('id') id: string,
    @Body() walletTransferDto: WalletTransferDto,
  ) {
    return this.userService.transferToWallet(
      +id,
      walletTransferDto.fromCurrency,
      walletTransferDto.toCurrency,
      walletTransferDto.amount,
    );
  }
}
