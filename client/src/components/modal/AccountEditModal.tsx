import { Button, Form, Input, Modal } from "antd";
import React, { memo, useContext, useEffect, useState } from "react";
import accountService from "../../api/AccountService";
import type { AccountDto } from "../../api/models/account";
import { MessageContext } from "../../App";

interface AccountEditModalProps {
  visible: boolean;
  account: AccountDto | null;
  onSave: (updatedAccount: AccountDto) => void;
  onCancel: () => void;
}

const AccountEditModal: React.FC<AccountEditModalProps> = ({
  visible,
  account,
  onSave,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [editting, setEditting] = useState(false);
  const messageApi = useContext(MessageContext);

  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        name: account.name
      });
    }
  }, [account, form]);

  const onFinish = async (values: { name: string }) => {
    try {
      setEditting(true);
      if (account) {
        await accountService.update(account.id, values);
        onSave({ ...account, name: values.name });
        messageApi?.open({
          type: "success",
          content: "Hesap güncellmesi başarılı"
        });
      }
    } catch (err) {
      messageApi?.open({
        type: "error",
        content: "Hesap güncellmesi başarısız oldu"
      });
    } finally {
      setEditting(false);
    }
  };

  return (
    <Modal
      title="Hesap Güncelleme"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      loading={editting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ name: account?.name }}
      >
        <Form.Item
          label="Hesap Adı"
          name="name"
          rules={[{ required: true, message: "Lütfen hesap adı giriniz!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Kaydet
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(AccountEditModal);
