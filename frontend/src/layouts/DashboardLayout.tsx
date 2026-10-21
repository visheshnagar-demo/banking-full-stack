import { AlertOutlined, BankOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import userService from "../api/UserService";
import { AuthContext, MessageContext } from "../App";
import styles from "./DashboardLayout.module.scss";

const { Header, Content, Sider } = Layout;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messageApi = useContext(MessageContext);

  const authValue = useContext(AuthContext);

  const logout = async () => {
    try {
      messageApi?.open({
        type: "loading",
        content: "Çıkış yapılıyor...",
        duration: 0,
        key: "loading_logout"
      });

      await userService.logout();
      authValue?.updateAuthInfo(undefined);
      messageApi?.open({
        type: "success",
        content: "Başarılı bir şekilde çıkış yapıldı"
      });
    } catch (err) {
      messageApi?.open({
        type: "error",
        content: "Çıkış başarısız oldu"
      });
    } finally {
      messageApi?.destroy("loading_logout");
    }
  };

  const selectedKey = location.pathname.startsWith("/")
    ? location.pathname.substring(1)
    : location.pathname;

  return (
    <Layout className={styles.layout}>
      <Sider>
        <div className={styles.logo}>
          <BankOutlined style={{ fontSize: 24, color: "white" }} />
          <span style={{ color: "white", marginLeft: 8 }}>Bankam</span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => navigate(`/${e.key}`)}
          items={[
            {
              key: "dashboard/accounts",
              label: "Hesaplar (Accounts)",
              icon: <BankOutlined />
            },
            {
              key: "dashboard/alerts",
              label: "Fraud Alerts",
              icon: <AlertOutlined />
            }
          ]}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerRight}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Çıkış Yap",
                    onClick: logout
                  }
                ]
              }}
              trigger={["click"]}
            >
              <span style={{ color: "white", cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {authValue?.authInfo?.username || "Kullanıcı"}
              </span>
            </Dropdown>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
