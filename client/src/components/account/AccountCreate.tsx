import { Button, Form, Input } from "antd";
import { memo, useContext, useState } from "react";
import accountService from "../../api/AccountService";
import type { AccountDto } from "../../api/models/account";
import { MessageContext } from "../../App";

const AccountCreate = ({ addAccount }: { addAccount: (account: AccountDto) => void }) => {
  const [loading, setLoading] = useState(false);
  const messageApi = useContext(MessageContext);

  const onFinish = async (values: { name: string; balance: number }) => {
    setLoading(true);
    try {
      const accountDto = await accountService.create(values);
      addAccount(accountDto);
      messageApi?.open({
        type: "success",
        content: "Hesap başarılı bir şekilde oluşturuldu"
      });
    } catch (error) {
      messageApi?.open({
        type: "error",
        content: "Hesap oluşturma başarısız"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" disabled={loading} onFinish={onFinish}>
      <Form.Item
        label="Hesap Adı"
        name="name"
        rules={[{ required: true, message: "Lütfen hesap adı giriniz" }]}
      >
        <Input placeholder="Hesap Adı Gir" />
      </Form.Item>

      <Form.Item
        label="Bakiye"
        name="balance"
        rules={[{ required: true, message: "Lütfen bakiye giriniz" }]}
      >
        <Input placeholder="Bakiye Giriniz" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Hesap Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
};

export default memo(AccountCreate);
