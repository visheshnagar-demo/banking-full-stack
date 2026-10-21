export interface AccountDto {
  id: string;
  name: string;
  number: string;
  balance: number;
  createdAt: string;
}

export interface AccountSearchRequest {
  name: string;
  number: string;
}

export interface TransferRequest {
  from: string;
  to: string;
  amount: number;
}

export interface AccountCreateRequest {
  balance: number;
  name: string;
}

export interface AccountUpdateRequest {
  name: string;
}
