import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from "@ant-design/icons";
import { Tag } from "antd";
import React from "react";
import type { FraudAlertStatus } from "../types/alert";

interface AlertStatusBadgeProps {
  status: FraudAlertStatus;
}

export const AlertStatusBadge: React.FC<AlertStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "PENDING":
      return (
        <Tag color="gold" icon={<ClockCircleOutlined />}>
          PENDING
        </Tag>
      );
    case "INVESTIGATING":
      return (
        <Tag color="processing" icon={<SyncOutlined spin />}>
          INVESTIGATING
        </Tag>
      );
    case "CONFIRMED_FRAUD":
      return (
        <Tag color="error" icon={<CloseCircleOutlined />}>
          CONFIRMED FRAUD
        </Tag>
      );
    case "DISMISSED":
      return (
        <Tag color="default" icon={<CheckCircleOutlined />}>
          DISMISSED
        </Tag>
      );
    default:
      return <Tag>{status}</Tag>;
  }
};

export default AlertStatusBadge;
