import { IsNotEmpty, Min } from 'class-validator';
import { Currencies } from 'src/util/utils';

export class WalletTopupDto {
  @IsNotEmpty()
  currency: Currencies;

  @IsNotEmpty()
  @Min(50)
  amount: number;
}