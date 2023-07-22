import { User } from 'src/user/entities/user.entity';
import {
  Currencies,
  TransactionStatuses,
  TransactionTypes,
} from 'src/util/utils';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  reference: string;

  @Column({ type: 'decimal', default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionTypes,
  })
  type: TransactionTypes;

  @Column({ type: 'enum', enum: Currencies, default: Currencies.NAIRA })
  fromCurrency: Currencies;

  @Column({ type: 'enum', enum: Currencies, default: Currencies.NAIRA })
  toCurrency: Currencies;

  @Column({
    type: 'enum',
    enum: TransactionStatuses,
    default: TransactionStatuses.PENDING,
  })
  status: TransactionStatuses;

  @Column({ type: 'decimal', default: 1 })
  rate: number;

  @Column({ type: 'boolean', default: false })
  requireApproval: boolean;

  @ManyToOne(() => User)
  approvedBy: User;

  @ManyToOne(() => User, (user) => user.transactions, { cascade: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
