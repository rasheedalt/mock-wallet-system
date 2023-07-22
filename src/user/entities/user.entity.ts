import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { Exclude } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30 })
  firstName: string;

  @Column({ type: 'varchar', length: 30 })
  lastName: string;

  @Column({ type: 'varchar', length: 30 })
  email: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Wallet, (wallet) => wallet.user, {
    eager: true,
    cascade: true,
  })
  wallets: Wallet[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    eager: false,
    cascade: false,
  })
  transactions: Transaction[];

  async validatePassword(password: string) {
    const isPasswordMatching = bcrypt.compare(password, this.password);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
