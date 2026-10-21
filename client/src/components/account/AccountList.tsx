// src/components/accounts/AccountList.tsx
import { Button, Input, Space, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import accountService from "../../api/AccountService";
import type { AccountDto } from "../../api/models/account";
import { MessageContext } from "../../App";
import AccountEditModal from "../modal/AccountEditModal";
import TransactionsModal from "../modal/TransactionsModal";

const AccountList = ({
  accounts,
  updateAccounts
}: {
  accounts: AccountDto[];
  updateAccounts: (accounts: AccountDto[]) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ name: "", number: "" });
  const messageApi = useContext(MessageContext);

  const [transactionsVisible, setTransactionsModalVisible] = useState(false);
  const [editAccountModalVisible, setEditAccountModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(null);

  const showTransactions = async (account: AccountDto) => {
    setSelectedAccount(account);
    setTransactionsModalVisible(true);
  };

  const openEditAccountModal = async (account: AccountDto) => {
    setSelectedAccount(account);
    setEditAccountModalVisible(true);
  };

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await accountService.getAccounts(query);
      updateAccounts(response);
    } catch (err) {
      messageApi?.open({
        type: "error",
        content: "Hesap listesi alınrken hata oluştu"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountEdit = (accountUpdated: AccountDto) => {
    setEditAccountModalVisible(false);
    updateAccounts(
      accounts.map((account) => {
        if (account.id === accountUpdated.id) return accountUpdated;
        return account;
      })
    );
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await accountService.delete(id);
      messageApi?.open({
        type: "success",
        content: "Hesap başarılı bir şekilde silindi"
      });
      updateAccounts(accounts.filter((account) => account.id !== id));
    } catch {
      messageApi?.open({
        type: "error",
        content: "Hesap silme işlemi başarısız oldu"
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Hesap Adı",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Hesap Numarası",
      dataIndex: "number",
      key: "number"
    },
    {
      title: "Bakiye",
      dataIndex: "balance",
      key: "balance",
      render: (value: number) => value.toFixed(2) + " ₺"
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_: any, record: AccountDto) => (
        <Space>
          <Button type="link" onClick={() => showTransactions(record)}>
            İşlemler
          </Button>
          <Button onClick={() => openEditAccountModal(record)} type="link">
            Güncelle
          </Button>
          <Button danger type="link" onClick={() => onDelete(record.id)}>
            Sil
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {transactionsVisible && (
        <TransactionsModal
          modalVisible={transactionsVisible}
          selectedAccount={selectedAccount}
          onCancel={() => {
            setTransactionsModalVisible(false);
          }}
        />
      )}
      {editAccountModalVisible && (
        <AccountEditModal
          onCancel={() => {
            setEditAccountModalVisible(false);
          }}
          onSave={handleAccountEdit}
          account={selectedAccount}
          visible={editAccountModalVisible}
        />
      )}

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="İsimle ara"
          value={query.name}
          onChange={(e) => setQuery({ ...query, name: e.target.value })}
        />
        <Input
          placeholder="Numara ile ara"
          value={query.number}
          onChange={(e) => setQuery({ ...query, number: e.target.value })}
        />
        <Button onClick={fetchAccounts}>Search</Button>
      </Space>

      <Table dataSource={accounts} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default AccountList;
