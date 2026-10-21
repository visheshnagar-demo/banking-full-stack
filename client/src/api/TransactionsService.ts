import axiosInstance from "./axiosInstance";
import type { TransferRequest } from "./models/account";
import type { TransactionDto } from "./models/transaction";
import API_PATHS from "./paths";

export class TransactionsService {
  async getByAccountNumber(accountId: string): Promise<TransactionDto[]> {
    console.log(API_PATHS.TRANSACTIONS_BY_ACCOUNT_ID(accountId));
    const response = await axiosInstance.get(API_PATHS.TRANSACTIONS_BY_ACCOUNT_ID(accountId));
    const success = response.data;
    return success.data;
  }

  async transfer(transferRequest: TransferRequest): Promise<void> {
    const result = await axiosInstance.post(API_PATHS.TRANSFER, transferRequest);
    const success = result.data;
    return success.data;
  }
}

const transactionsService = new TransactionsService();
export default transactionsService;
