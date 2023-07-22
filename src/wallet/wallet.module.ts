import { forwardRef, Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UserModule } from 'src/user/user.module';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), forwardRef(() => UserModule)],
  controllers: [],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule {}
