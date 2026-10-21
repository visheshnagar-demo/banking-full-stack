import { Modal, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import type { AccountDto } from "../../api/models/account";
import type { TransactionDto } from "../../api/models/transaction";
import transactionsService from "../../api/TransactionsService";
import { MessageContext } from "../../App";

interface TransactionsModalProps {
  modalVisible: boolean;
  selectedAccount: AccountDto | null;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const TransactionsModal = ({ modalVisible, selectedAccount, onCancel }: TransactionsModalProps) => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const messageApi = useContext(MessageContext);

  const transactionColumns = [
    { title: "Gönderen", dataIndex: "fromNumber", key: "fromNumber" },
    { title: "Alıcı", dataIndex: "toNumber", key: "toNumber" },
    {
      title: "Tutar",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => val.toFixed(2) + " ₺"
    },
    { title: "Durum", dataIndex: "status", key: "status" },
    {
      title: "Tarih",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date: string) => new Date(date).toLocaleString()
    }
  ];

  useEffect(() => {
    if (modalVisible && selectedAccount) {
      (async () => {
        try {
          setLoadingTransactions(true);
          const response = await transactionsService.getByAccountNumber(selectedAccount.id);
          setTransactions(response);
        } catch (error) {
          messageApi?.open({
            type: "error",
            content: "İşlemler yüklenirken bir hata oluştu"
          });
        } finally {
          setLoadingTransactions(false);
        }
      })();
    }
  }, [modalVisible]);

  return (
    <Modal
      title={`Hesap İşlemleri: ${selectedAccount?.name}`}
      open={modalVisible}
      onCancel={onCancel}
      loading={loadingTransactions}
      footer={null}
      width={1024}
    >
      <Table
        dataSource={transactions}
        columns={transactionColumns}
        loading={loadingTransactions}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default TransactionsModal;
