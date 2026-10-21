import axiosInstance from "./axiosInstance";
import API_PATHS from "./paths";
import type {
  FraudAlert,
  FraudAlertFilterParams,
  UpdateFraudAlertStatusRequest
} from "../types/alert";

export class AlertService {
  async getAlerts(params?: FraudAlertFilterParams): Promise<FraudAlert[]> {
    const queryParams: Record<string, any> = {};

    if (params?.status && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params?.minRiskScore !== undefined) {
      queryParams.minRiskScore = params.minRiskScore;
    }
    if (params?.maxRiskScore !== undefined) {
      queryParams.maxRiskScore = params.maxRiskScore;
    }
    if (params?.severity && params.severity !== "ALL") {
      if (params.severity === "HIGH") {
        queryParams.minRiskScore = 76;
      } else if (params.severity === "MEDIUM") {
        queryParams.minRiskScore = 40;
        queryParams.maxRiskScore = 75;
      } else if (params.severity === "LOW") {
        queryParams.maxRiskScore = 39;
      }
    }
    if (params?.page !== undefined) queryParams.page = params.page;
    if (params?.size !== undefined) queryParams.size = params.size;

    const response = await axiosInstance.get(API_PATHS.ALERTS, {
      params: queryParams
    });

    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
      return (data.data as FraudAlert[]) || [];
    }
    return Array.isArray(data) ? data : [];
  }

  async getAlertById(id: string): Promise<FraudAlert> {
    const response = await axiosInstance.get(API_PATHS.ALERT_BY_ID(id));
    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
      return data.data as FraudAlert;
    }
    return data as FraudAlert;
  }

  async updateAlertStatus(
    id: string,
    payload: UpdateFraudAlertStatusRequest
  ): Promise<FraudAlert | void> {
    const response = await axiosInstance.patch(API_PATHS.ALERT_STATUS(id), payload);
    const data = response.data;
    if (data && typeof data === "object" && "data" in data) {
      return data.data as FraudAlert;
    }
    return data as FraudAlert;
  }
}

export const alertService = new AlertService();
export default alertService;
