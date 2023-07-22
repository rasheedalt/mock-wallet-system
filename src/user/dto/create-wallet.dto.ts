import { IsNotEmpty } from 'class-validator';
import { Currencies } from 'src/util/utils';

export class CreateWalletDto {
  @IsNotEmpty()
  currency: Currencies;
}