// src/pages/LoginPage.tsx
import { Button, Form, Input, Typography } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../api/UserService";
import { AuthContext, MessageContext } from "../../App";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isFetching, setFetching] = useState(false);
  const messageApi = useContext(MessageContext);
  const auth = useContext(AuthContext);

  const onFinish = async (values: any) => {
    try {
      const loginRequest = {
        username: values.username,
        password: values.password
      };

      setFetching(true);
      messageApi?.open({
        type: "loading",
        content: "Giriş yapılıyor",
        duration: 0,
        key: "loading_login"
      });

      const userInfo = await userService.login(loginRequest);
      messageApi?.open({
        type: "success",
        content: "Giriş başarılı!"
      });

      auth?.updateAuthInfo(userInfo.user);
    } catch (err) {
      messageApi?.open({
        type: "error",
        content: "Giriş yapılamadı."
      });
    } finally {
      setFetching(false);
      messageApi?.destroy("loading_login");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: "10%" }}>
      <Title level={2}>Giriş Yap</Title>
      <Form disabled={isFetching} layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Kullanıcı Adı" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Şifre" rules={[{ required: true, min: 8, max: 64 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Giriş
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate("/register")} block>
            Hesabınız yok mu? Kayıt olun
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
