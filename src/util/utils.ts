export interface HTTPResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export class Response<T> implements HTTPResponse<T> {
  statusCode = 200;
  success = true;
  message = 'success';
  data: T = null;

  constructor(success: boolean, data?: T, message?: string) {
    this.success = success;
    this.message = message || 'success';
    if (data) {
      this.data = data;
    }
  }
}

export enum Currencies {
  NAIRA = 'NAIRA',
  DOLLAR = 'DOLLAR',
  POUNDS = 'POUNDS',
}

export enum TransactionTypes {
  CREDIT = 'credit',
  TRANSFER = 'transfer',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionStatuses {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING_APPROVAL = 'pending_approval',
  CANCELLED = 'cancelled',
  REVERSED = 'reversed'
}

export interface TokenPayload {
  userId: number;
}

// a more complex algo might be required
export const generateRandomString = (): string => {
  const timeStamp = new Date().getTime();
  return Math.random().toString().concat(
    timeStamp.toString()
    ).toString().substring(2, 10);
}

export const TRANFER_WITHOUT_APPROVAL_LIMIT = 1000000;

// Will be from a reliable FX rate soure or based on a dynamic settings
export const CONVERSION_RATES = {
  "NAIRA": {
    "DOLLAR": 1/800,
    "POUNDS": 1/1100,
  },
  "POUNDS": {
    "DOLLAR": 1.2,
    "NAIRA": 1100,
  },
  "DOLLAR": {
    "NAIRA": 800,
    "POUNDS": 0.8,
  },
}
