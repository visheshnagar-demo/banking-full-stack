import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  ReloadOutlined,
  SearchOutlined,
  SyncOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useContext, useEffect, useMemo, useState } from "react";
import alertService from "../api/alerts";
import { MessageContext } from "../App";
import type {
  AlertReason,
  FraudAlert,
  FraudAlertFilterParams,
  FraudAlertStatus
} from "../types/alert";
import AlertInvestigationModal from "./AlertInvestigationModal";
import AlertStatusBadge from "./AlertStatusBadge";
import RiskScoreTag from "./RiskScoreTag";

const { Text, Title } = Typography;

export const FraudAlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<FraudAlertStatus | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [searchText, setSearchText] = useState<string>("");

  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);
  const [investigationModalOpen, setInvestigationModalOpen] = useState<boolean>(false);

  const messageApi = useContext(MessageContext);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params: FraudAlertFilterParams = {};
      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      if (severityFilter !== "ALL") {
        params.severity = severityFilter;
      }

      const data = await alertService.getAlerts(params);
      setAlerts(data);
    } catch {
      messageApi?.open({
        type: "error",
        content: "Failed to load fraud alerts from server."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const handleOpenInvestigation = (alert: FraudAlert) => {
    setSelectedAlert(alert);
    setInvestigationModalOpen(true);
  };

  const handleStatusUpdated = (updatedAlert: FraudAlert) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((item) => (item.id === updatedAlert.id ? updatedAlert : item))
    );
  };

  // Filter alerts by search query
  const filteredAlerts = useMemo(() => {
    if (!searchText.trim()) return alerts;
    const query = searchText.toLowerCase().trim();
    return alerts.filter((alert) => {
      const idMatch = alert.id?.toLowerCase().includes(query);
      const txMatch = alert.transactionRef?.toLowerCase().includes(query);
      const accMatch =
        alert.accountNumber?.toLowerCase().includes(query) ||
        alert.accountId?.toLowerCase().includes(query) ||
        alert.account?.number?.toLowerCase().includes(query);
      const reasonMatch = alert.alertReason?.toLowerCase().includes(query);
      return idMatch || txMatch || accMatch || reasonMatch;
    });
  }, [alerts, searchText]);

  // Statistics
  const statistics = useMemo(() => {
    const total = alerts.length;
    const pending = alerts.filter((a) => a.status === "PENDING").length;
    const investigating = alerts.filter((a) => a.status === "INVESTIGATING").length;
    const confirmed = alerts.filter((a) => a.status === "CONFIRMED_FRAUD").length;
    const dismissed = alerts.filter((a) => a.status === "DISMISSED").length;
    const highRisk = alerts.filter((a) => a.riskScore > 75).length;

    return { total, pending, investigating, confirmed, dismissed, highRisk };
  }, [alerts]);

  const formatReasonTag = (reason: AlertReason) => {
    let color = "default";
    if (reason === "HIGH_VELOCITY") color = "magenta";
    else if (reason === "LARGE_AMOUNT") color = "volcano";
    else if (reason === "UNUSUAL_LOCATION") color = "purple";

    const label = reason.replace(/_/g, " ");
    return <Tag color={color}>{label}</Tag>;
  };

  const columns: ColumnsType<FraudAlert> = [
    {
      title: "Alert ID / Ref",
      dataIndex: "id",
      key: "id",
      width: 130,
      render: (id: string) => (
        <Tooltip title={`Full ID: ${id}`}>
          <Text code copyable={{ text: id }}>
            {id ? id.substring(0, 8) : "N/A"}
          </Text>
        </Tooltip>
      )
    },
    {
      title: "Transaction Ref",
      dataIndex: "transactionRef",
      key: "transactionRef",
      render: (ref: string) => <Text copyable>{ref}</Text>
    },
    {
      title: "Account",
      key: "account",
      render: (_, record) => (
        <div>
          <Text strong>{record.accountNumber || record.account?.number || "Account"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.accountId?.substring(0, 8)}...
          </Text>
        </div>
      )
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => (
        <Text strong style={{ color: "#cf1322" }}>
          {typeof amount === "number" ? amount.toFixed(2) : amount} ₺
        </Text>
      )
    },
    {
      title: "Risk Score",
      dataIndex: "riskScore",
      key: "riskScore",
      sorter: (a, b) => a.riskScore - b.riskScore,
      render: (score: number) => <RiskScoreTag score={score} />
    },
    {
      title: "Alert Reason",
      dataIndex: "alertReason",
      key: "alertReason",
      render: (reason: AlertReason) => formatReasonTag(reason)
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: FraudAlertStatus) => <AlertStatusBadge status={status} />
    },
    {
      title: "Detected At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (date ? new Date(date).toLocaleString() : "N/A")
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<ExclamationCircleOutlined />}
          onClick={() => handleOpenInvestigation(record)}
        >
          Review
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100%" }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>
          <AlertOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          Fraud & Suspicious Activity Alerts
        </Title>
        <Text type="secondary">
          Monitor suspicious transactions, investigate high-risk events, and execute account freeze
          mitigations.
        </Text>
      </div>

      {/* KPI Statistic Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card bordered={false} size="small">
            <Statistic
              title="Total Alerts"
              value={statistics.total}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Card bordered={false} size="small">
            <Statistic
              title="Pending Review"
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Card bordered={false} size="small">
            <Statistic
              title="Investigating"
              value={statistics.investigating}
              prefix={<SyncOutlined spin={statistics.investigating > 0} />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Card bordered={false} size="small">
            <Statistic
              title="Confirmed Fraud"
              value={statistics.confirmed}
              prefix={<LockOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={5}>
          <Card bordered={false} size="small">
            <Statistic
              title="Dismissed"
              value={statistics.dismissed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        bordered={false}
        title={
          <Space wrap align="center">
            <Select
              value={statusFilter}
              style={{ width: 180 }}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: "ALL", label: "Status: All" },
                { value: "PENDING", label: "Status: Pending" },
                { value: "INVESTIGATING", label: "Status: Investigating" },
                { value: "CONFIRMED_FRAUD", label: "Status: Confirmed Fraud" },
                { value: "DISMISSED", label: "Status: Dismissed" }
              ]}
            />

            <Select
              value={severityFilter}
              style={{ width: 180 }}
              onChange={(value) => setSeverityFilter(value)}
              options={[
                { value: "ALL", label: "Severity: All" },
                { value: "HIGH", label: "High Risk (>75)" },
                { value: "MEDIUM", label: "Medium Risk (40-75)" },
                { value: "LOW", label: "Low Risk (<40)" }
              ]}
            />

            <Input
              placeholder="Search by Transaction Ref / Account / Reason..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{ width: 320 }}
            />
          </Space>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={fetchAlerts} loading={loading}>
            Refresh
          </Button>
        }
      >
        <Table<FraudAlert>
          columns={columns}
          dataSource={filteredAlerts}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => `Total ${total} alert(s)`
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Investigation Modal */}
      {selectedAlert && (
        <AlertInvestigationModal
          visible={investigationModalOpen}
          alert={selectedAlert}
          onClose={() => {
            setInvestigationModalOpen(false);
            setSelectedAlert(null);
          }}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

export default FraudAlertsView;
