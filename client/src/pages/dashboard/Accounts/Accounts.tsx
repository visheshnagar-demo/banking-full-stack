import { Tabs } from "antd";
import { useCallback, useState } from "react";
import type { AccountDto, TransferRequest } from "../../../api/models/account";
import AccountCreate from "../../../components/account/AccountCreate";
import AccountList from "../../../components/account/AccountList";
import AccountTransfer from "../../../components/account/AccountTransfer";

const Accounts = () => {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);

  const addAccount = useCallback((account: AccountDto): void => {
    setAccounts((prev) => {
      const accounts = [...prev];
      accounts.unshift(account);
      return accounts;
    });
  }, []);

  const transfer = useCallback((transferData: TransferRequest) => {
    setAccounts((prev) => {
      return prev.map((account) => {
        if (account.number === transferData.from) {
          return {
            ...account,
            balance: account.balance - transferData.amount
          };
        }

        if (account.number === transferData.to) {
          return {
            ...account,
            balance: account.balance + transferData.amount
          };
        }

        return account;
      });
    });
  }, []);

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: "Accounts",
          children: <AccountList accounts={accounts} updateAccounts={setAccounts} />
        },
        {
          key: "2",
          label: "Create Account",
          children: <AccountCreate addAccount={addAccount} />
        },
        {
          key: "3",
          label: "Transfer",
          children: <AccountTransfer transfer={transfer} />
        }
      ]}
    />
  );
};

export default Accounts;
