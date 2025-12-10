// src/context/LifeInsuranceContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface LifeInfo {
  age: number;
  height: number;
  weight: number;
  coverageAmount?: number;
  beneficiaryName?: string;
  beneficiaryRelation?: string;
  policyTermYears?: number;
  smokerStatus?: string;
  lifeInsuranceType?: "FullLife" | "HalfLife";
  categoryId?: string;
  subCategoryId?: string;
  message?: string;
}

export interface BackendLifeApplicationResponse {
  applicationId: string;
  clientId: string;
  categoryName: string;
  subCategoryName: string;
  age: number;
  height: number;
  weight: number;
  lifePrice: number;
  lifeInsuranceType: string;
  status: string;
  createdAt: string;
  message: string;
  clientFullName: string;
  clientEmail: string;
  clientPhoneNumber: string;
  clientGender: string;
  clientDateOfBirth: string;
  clientNationalIdOrPassport: string;
  clientPassportOrNationalIdImageUrl: string;
}

interface LifeInsuranceContextValue {
  lifeInfo: LifeInfo | null;
  setLifeInfo: (info: LifeInfo) => void;
  backendLifeApplicationData: BackendLifeApplicationResponse | null;
  setBackendLifeApplicationData: (data: BackendLifeApplicationResponse | null) => void;
  resetLifeApplication: () => void;

    // Optional: Add loading states
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
  error?: string | null;
  setError?: (error: string | null) => void;
}

const LifeInsuranceContext = createContext<LifeInsuranceContextValue | undefined>(undefined);

export const LifeInsuranceProvider = ({ children }: { children: ReactNode }) => {
  const [lifeInfo, setLifeInfoState] = useState<LifeInfo | null>(null);
  const [backendLifeApplicationData, setBackendLifeApplicationDataState] = useState<BackendLifeApplicationResponse | null>(null);

  const resetLifeApplication = () => {
    setLifeInfoState(null);
    setBackendLifeApplicationDataState(null);
  };

  const value: LifeInsuranceContextValue = {
    lifeInfo,
    setLifeInfo: setLifeInfoState,
    backendLifeApplicationData,
    setBackendLifeApplicationData: setBackendLifeApplicationDataState,
    resetLifeApplication
  };

  return <LifeInsuranceContext.Provider value={value}>{children}</LifeInsuranceContext.Provider>;
};

export const useLifeInsurance = () => {
  const ctx = useContext(LifeInsuranceContext);
  if (!ctx) {
    throw new Error("useLifeInsurance must be used within LifeInsuranceProvider");
  }
  return ctx;
};