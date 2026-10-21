// src/components/accounts/AccountTransfer.tsx
import { Button, Form, Input, InputNumber, Space } from "antd";
import { useContext, useState } from "react";
import transactionsService from "../../api/TransactionsService";
import { MessageContext } from "../../App";

interface TransferForm {
  from: string;
  to: string;
  amount: number;
}

const AccountTransfer = ({ transfer }: { transfer: (account: TransferForm) => void }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const messageApi = useContext(MessageContext);

  const onFinish = async (values: TransferForm) => {
    setLoading(true);
    try {
      messageApi?.open({
        type: "loading",
        content: "Kayıt Gerçekleşiyor",
        duration: 0,
        key: "loading_transfer"
      });

      const transferObject: TransferForm = {
        from: values.from?.trim(),
        to: values.to?.trim(),
        amount: values.amount
      };

      await transactionsService.transfer(transferObject);

      messageApi?.open({
        type: "success",
        content: "Transfer başarılı"
      });
      transfer(transferObject);

      form.resetFields();
    } catch {
      messageApi?.open({
        type: "error",
        content: "Transfer sırasında hata oluştu."
      });
    } finally {
      setLoading(false);
      messageApi?.destroy("loading_transfer");
    }
  };

  return (
    <Form
      disabled={loading}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400 }}
    >
      <Form.Item
        label="Gönderen Hesap Numarası"
        name="from"
        rules={[{ required: true, message: "Gönderen hesap numarası zorunlu" }]}
      >
        <Input placeholder="Gönderen hesap numarasını girin" />
      </Form.Item>

      <Form.Item
        label="Alıcı Hesap Numarası"
        name="to"
        rules={[{ required: true, message: "Alıcı hesap numarası zorunlu" }]}
      >
        <Input placeholder="Alıcı hesap numarasını girin" />
      </Form.Item>

      <Form.Item
        label="Tutar"
        name="amount"
        rules={[
          { required: true, message: "Tutar zorunlu" },
          { type: "number", min: 0.01, message: "Tutar 0'dan büyük olmalı" }
        ]}
      >
        <InputNumber<number>
          style={{ width: "100%" }}
          min={0.01 as number}
          step={0.01}
          placeholder="Transfer tutarı"
          formatter={(value) => (value !== undefined && value !== null ? `${value} ₺` : "")}
          parser={(value) =>
            value ? (parseFloat(value.replace(/₺\s?|(,*)/g, "")) as number) : (0 as number)
          }
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Transfer Yap
          </Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Temizle
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AccountTransfer;
