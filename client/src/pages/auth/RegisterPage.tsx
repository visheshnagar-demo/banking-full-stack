// src/pages/RegisterPage.tsx
import { Button, Form, Input, Typography } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../api/UserService";
import { MessageContext } from "../../App";

const { Title } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const messageApi = useContext(MessageContext);
  const [isFetching, setFetching] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const registerRequest = {
        username: values.username,
        password: values.password,
        email: values.email
      };

      setFetching(true);
      messageApi?.open({
        type: "loading",
        content: "Kayıt Gerçekleşiyor",
        duration: 0,
        key: "loading_register"
      });

      await userService.createUser(registerRequest);
      messageApi?.open({
        type: "success",
        content: "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz."
      });

      navigate("/login");
    } catch (err) {
      messageApi?.open({
        type: "error",
        content: "Kayıt başarısız"
      });
    } finally {
      setFetching(false);
      messageApi?.destroy("loading_register");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: "10%" }}>
      <Title level={2}>Kayıt Ol</Title>
      <Form disabled={isFetching} layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Kullanıcı Adı" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="E-posta" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Şifre" rules={[{ required: true, min: 8, max: 64 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Kayıt Ol
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate("/login")} block>
            Zaten hesabınız var mı? Giriş yap
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
