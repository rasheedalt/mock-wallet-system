import { IsNotEmpty, Min } from 'class-validator';
import { Currencies } from 'src/util/utils';

export class WalletTransferDto {
  @IsNotEmpty()
  fromCurrency: Currencies;

  @IsNotEmpty()
  toCurrency: Currencies;

  @IsNotEmpty()
  @Min(50)
  amount: number;
}