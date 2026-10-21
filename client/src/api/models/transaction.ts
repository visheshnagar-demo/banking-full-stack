export interface TransactionDto {
  id: string;
  fromNumber: string;
  toNumber: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  createdAt: string;
}
