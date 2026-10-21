import axiosInstance from "./axiosInstance";
import type {
  AccountCreateRequest,
  AccountDto,
  AccountSearchRequest,
  AccountUpdateRequest
} from "./models/account";
import API_PATHS from "./paths";

export class AccountService {
  async getAccounts(accountSearchRequest: AccountSearchRequest): Promise<AccountDto[]> {
    const response = await axiosInstance.get(API_PATHS.ACCOUNTS, {
      params: accountSearchRequest
    });
    const success = response.data;
    return success.data;
  }

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(API_PATHS.DELETE_ACCOUNT_BY_ID(id));
  }

  async create(accountCreateRequest: AccountCreateRequest): Promise<AccountDto> {
    const result = await axiosInstance.post(API_PATHS.ACCOUNTS, accountCreateRequest);
    const success = result.data;
    return success.data;
  }

  async update(id: string, accountCreateRequest: AccountUpdateRequest): Promise<void> {
    await axiosInstance.put(API_PATHS.ACCOUNT_UPDATE_BY_ID(id), accountCreateRequest);
  }
}

const accountService = new AccountService();
export default accountService;
