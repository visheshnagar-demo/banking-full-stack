import { FireOutlined, SafetyCertificateOutlined, WarningOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import React from "react";

interface RiskScoreTagProps {
  score: number;
  showIcon?: boolean;
}

export const RiskScoreTag: React.FC<RiskScoreTagProps> = ({ score, showIcon = true }) => {
  if (score > 75) {
    return (
      <Tag color="error" icon={showIcon ? <FireOutlined /> : undefined}>
        High ({score})
      </Tag>
    );
  }

  if (score >= 40) {
    return (
      <Tag color="warning" icon={showIcon ? <WarningOutlined /> : undefined}>
        Medium ({score})
      </Tag>
    );
  }

  return (
    <Tag color="success" icon={showIcon ? <SafetyCertificateOutlined /> : undefined}>
      Low ({score})
    </Tag>
  );
};

export default RiskScoreTag;
