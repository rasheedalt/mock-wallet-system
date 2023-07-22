import { User } from 'src/user/entities/user.entity';
import { Currencies } from 'src/util/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Currencies, default: Currencies.NAIRA })
  currency: Currencies;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @Column({ type: 'decimal', default: 0 })
  lockedBalance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wallets, { eager: false })
  user: User;
}
