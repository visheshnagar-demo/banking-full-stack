export type FraudAlertStatus = "PENDING" | "INVESTIGATING" | "CONFIRMED_FRAUD" | "DISMISSED";

export type AlertReason = "HIGH_VELOCITY" | "LARGE_AMOUNT" | "UNUSUAL_LOCATION" | string;

export interface AccountContext {
  id: string;
  number?: string;
  name?: string;
  balance?: number;
  userId?: string;
}

export interface FraudAlert {
  id: string;
  accountId: string;
  accountNumber?: string;
  accountHolderName?: string;
  account?: AccountContext;
  transactionRef: string;
  amount: number;
  riskScore: number;
  alertReason: AlertReason;
  status: FraudAlertStatus;
  reviewerNotes?: string;
  reviewerId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateFraudAlertStatusRequest {
  status: FraudAlertStatus;
  reviewerNotes: string;
  reviewerId?: string;
}

export interface FraudAlertFilterParams {
  status?: FraudAlertStatus | "ALL";
  severity?: "HIGH" | "MEDIUM" | "LOW" | "ALL";
  minRiskScore?: number;
  maxRiskScore?: number;
  search?: string;
  page?: number;
  size?: number;
}
