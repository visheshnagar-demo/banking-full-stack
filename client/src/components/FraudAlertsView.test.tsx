import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import alertService from "../api/alerts";
import type { FraudAlert } from "../types/alert";
import AlertInvestigationModal from "./AlertInvestigationModal";
import FraudAlertsView from "./FraudAlertsView";
import RiskScoreTag from "./RiskScoreTag";

// Mock alert service
vi.mock("../api/alerts", () => ({
  default: {
    getAlerts: vi.fn(),
    getAlertById: vi.fn(),
    updateAlertStatus: vi.fn()
  }
}));

const mockAlerts: FraudAlert[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    accountId: "acc-1111-2222-3333",
    accountNumber: "TR12345678",
    transactionRef: "TX-998877",
    amount: 15000.5,
    riskScore: 88,
    alertReason: "HIGH_VELOCITY",
    status: "PENDING",
    createdAt: "2026-05-18T10:30:00Z"
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    accountId: "acc-4444-5555-6666",
    accountNumber: "TR87654321",
    transactionRef: "TX-112233",
    amount: 3200.0,
    riskScore: 55,
    alertReason: "LARGE_AMOUNT",
    status: "INVESTIGATING",
    reviewerNotes: "Contacted customer",
    reviewerId: "analyst-1",
    createdAt: "2026-05-18T11:00:00Z"
  }
];

describe("RiskScoreTag", () => {
  it("renders High risk tag for scores > 75", () => {
    render(<RiskScoreTag score={85} />);
    expect(screen.getByText(/High \(85\)/i)).toBeInTheDocument();
  });

  it("renders Medium risk tag for scores between 40 and 75", () => {
    render(<RiskScoreTag score={50} />);
    expect(screen.getByText(/Medium \(50\)/i)).toBeInTheDocument();
  });

  it("renders Low risk tag for scores < 40", () => {
    render(<RiskScoreTag score={20} />);
    expect(screen.getByText(/Low \(20\)/i)).toBeInTheDocument();
  });
});

describe("FraudAlertsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (alertService.getAlerts as any).mockResolvedValue(mockAlerts);
  });

  it("renders title, statistic cards, and alert table rows", async () => {
    render(<FraudAlertsView />);

    expect(screen.getByText(/Fraud & Suspicious Activity Alerts/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("TX-998877")).toBeInTheDocument();
      expect(screen.getByText("TX-112233")).toBeInTheDocument();
    });

    expect(screen.getByText(/High \(88\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Medium \(55\)/i)).toBeInTheDocument();
  });

  it("opens investigation modal when review button is clicked", async () => {
    render(<FraudAlertsView />);

    await waitFor(() => {
      expect(screen.getByText("TX-998877")).toBeInTheDocument();
    });

    const reviewButtons = screen.getAllByRole("button", { name: /Review/i });
    fireEvent.click(reviewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Fraud Alert Investigation/i)).toBeInTheDocument();
    });
  });
});

describe("AlertInvestigationModal", () => {
  it("renders alert details and action buttons", () => {
    const onStatusUpdated = vi.fn();
    const onClose = vi.fn();

    render(
      <AlertInvestigationModal
        visible={true}
        alert={mockAlerts[0]}
        onClose={onClose}
        onStatusUpdated={onStatusUpdated}
      />
    );

    expect(screen.getByText("TX-998877")).toBeInTheDocument();
    expect(screen.getByText(/TR12345678/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Resolve \/ Dismiss/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mark Investigating/i })).toBeInTheDocument();
  });
});
