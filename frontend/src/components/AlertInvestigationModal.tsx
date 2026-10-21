import {
  CheckOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Typography
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import alertService from "../api/alerts";
import { AuthContext, MessageContext } from "../App";
import type { FraudAlert, FraudAlertStatus } from "../types/alert";
import AlertStatusBadge from "./AlertStatusBadge";
import RiskScoreTag from "./RiskScoreTag";

const { Text } = Typography;

interface AlertInvestigationModalProps {
  visible: boolean;
  alert: FraudAlert | null;
  onClose: () => void;
  onStatusUpdated: (updatedAlert: FraudAlert) => void;
}

export const AlertInvestigationModal: React.FC<AlertInvestigationModalProps> = ({
  visible,
  alert,
  onClose,
  onStatusUpdated
}) => {
  const [form] = Form.useForm();
  const [loadingAction, setLoadingAction] = useState<FraudAlertStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messageApi = useContext(MessageContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (visible && alert) {
      form.setFieldsValue({
        reviewerNotes: alert.reviewerNotes || ""
      });
      setErrorMessage(null);
    }
  }, [visible, alert, form]);

  if (!alert) return null;

  const handleUpdateStatus = async (newStatus: FraudAlertStatus) => {
    try {
      const values = await form.validateFields();
      setLoadingAction(newStatus);
      setErrorMessage(null);

      const reviewerId = authContext?.authInfo?.username || "fraud-analyst";

      const updated = await alertService.updateAlertStatus(alert.id, {
        status: newStatus,
        reviewerNotes: values.reviewerNotes?.trim() || "",
        reviewerId
      });

      messageApi?.open({
        type: "success",
        content: `Alert status updated to ${newStatus}`
      });

      const updatedAlertData: FraudAlert = (updated as FraudAlert) || {
        ...alert,
        status: newStatus,
        reviewerNotes: values.reviewerNotes?.trim() || "",
        reviewerId,
        updatedAt: new Date().toISOString()
      };

      onStatusUpdated(updatedAlertData);
      onClose();
    } catch (err: any) {
      if (err?.errorFields) {
        return; // Validation error
      }
      const errorMsg =
        err?.response?.data?.message || err?.message || "Failed to update alert status.";
      setErrorMessage(errorMsg);
      messageApi?.open({
        type: "error",
        content: errorMsg
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const formatReason = (reason: string) => {
    return reason.replace(/_/g, " ");
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={
        <Space align="center">
          <ExclamationCircleOutlined style={{ color: "#faad14", fontSize: 20 }} />
          <span>Fraud Alert Investigation &mdash; #{alert.id.substring(0, 8)}</span>
        </Space>
      }
      width={720}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginTop: 16 }}>
        {errorMessage && (
          <Alert
            message="Action Failed"
            description={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Card size="small" style={{ marginBottom: 16, backgroundColor: "#fafafa" }}>
          <Descriptions title="Transaction & Risk Overview" bordered size="small" column={2}>
            <Descriptions.Item label="Alert ID">{alert.id}</Descriptions.Item>
            <Descriptions.Item label="Current Status">
              <AlertStatusBadge status={alert.status} />
            </Descriptions.Item>

            <Descriptions.Item label="Risk Score">
              <RiskScoreTag score={alert.riskScore} />
            </Descriptions.Item>
            <Descriptions.Item label="Trigger Reason">
              <Text strong>{formatReason(alert.alertReason)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Account ID">
              <Text copyable>{alert.accountId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Account Number">
              <Text strong>{alert.accountNumber || alert.account?.number || "N/A"}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Transaction Ref">
              <Text copyable code>
                {alert.transactionRef}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Flagged Amount">
              <Text strong style={{ color: "#cf1322", fontSize: 16 }}>
                {typeof alert.amount === "number" ? alert.amount.toFixed(2) : alert.amount} ₺
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Detected At">
              {new Date(alert.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Last Reviewed By">
              {alert.reviewerId || "Unassigned"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Form form={form} layout="vertical">
          <Form.Item
            label="Analyst Investigation Notes"
            name="reviewerNotes"
            rules={[
              {
                required: true,
                message: "Please enter investigation notes before updating alert status"
              },
              {
                min: 5,
                message: "Investigation notes must be at least 5 characters long"
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Document your findings, customer verification steps, or rationale for decision..."
              showCount
              maxLength={1000}
            />
          </Form.Item>
        </Form>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button onClick={onClose} disabled={loadingAction !== null}>
            Close
          </Button>

          <Space>
            <Button
              icon={<SearchOutlined />}
              loading={loadingAction === "INVESTIGATING"}
              disabled={loadingAction !== null}
              onClick={() => handleUpdateStatus("INVESTIGATING")}
            >
              Mark Investigating
            </Button>

            <Button
              icon={<CheckOutlined />}
              loading={loadingAction === "DISMISSED"}
              disabled={loadingAction !== null}
              onClick={() => handleUpdateStatus("DISMISSED")}
            >
              Resolve / Dismiss
            </Button>

            <Popconfirm
              title="Confirm Fraud & Freeze Account"
              description="Are you sure this transaction is fraudulent? This will mark the alert and trigger account freeze protections."
              onConfirm={() => handleUpdateStatus("CONFIRMED_FRAUD")}
              okText="Yes, Confirm & Freeze"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                icon={<LockOutlined />}
                loading={loadingAction === "CONFIRMED_FRAUD"}
                disabled={loadingAction !== null}
              >
                Confirm Fraud & Freeze Account
              </Button>
            </Popconfirm>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default AlertInvestigationModal;
