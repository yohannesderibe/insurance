import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface PersonalInfo {
  fullName: string;
  fathersName: string;
  grandfathersName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  nationalId: string;
  maritalStatus: string;
  occupation: string;
  categoryId: string;
  categoryName?: string;
  subCategoryId: string;
  subCategoryName?: string;
  documents: File[];
}

export interface CarInfo {
  carName: string;
  modelNumber: string;
  carType: string;
  fuelType: string;
  yearOfManufacture: string;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
  marketPrice: number;
}

export interface CoverageSelection {
  motorTheft: boolean;
  naturalDisaster: boolean;
  personalAccident: boolean;
  thirdPartyLiability: boolean;
}

export interface CalculationTotals {
  basePrice: number;
  optionalTotal: number;
  total: number;
}

interface InsuranceApplicationContextValue {
  personalInfo: PersonalInfo | null;
  setPersonalInfo: (info: PersonalInfo) => void;
  carInfo: CarInfo | null;
  setCarInfo: (info: CarInfo) => void;
  coverages: CoverageSelection;
  setCoverages: (coverages: CoverageSelection) => void;
  calculationTotals: CalculationTotals | null;
  setCalculationTotals: (totals: CalculationTotals | null) => void;
  financeDecision: "approved" | "rejected" | null;
  setFinanceDecision: (decision: "approved" | "rejected" | null) => void;
  resetApplication: () => void;
}

const InsuranceApplicationContext = createContext<InsuranceApplicationContextValue | undefined>(undefined);

const defaultCoverages: CoverageSelection = {
  motorTheft: false,
  naturalDisaster: false,
  personalAccident: false,
  thirdPartyLiability: false
};

export const InsuranceApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [personalInfo, setPersonalInfoState] = useState<PersonalInfo | null>(null);
  const [carInfo, setCarInfoState] = useState<CarInfo | null>(null);
  const [coverages, setCoveragesState] = useState<CoverageSelection>(defaultCoverages);
  const [calculationTotals, setCalculationTotalsState] = useState<CalculationTotals | null>(null);
  const [financeDecision, setFinanceDecisionState] = useState<"approved" | "rejected" | null>(null);

  const resetApplication = () => {
    setPersonalInfoState(null);
    setCarInfoState(null);
    setCoveragesState(defaultCoverages);
    setCalculationTotalsState(null);
    setFinanceDecisionState(null);
  };

  const value: InsuranceApplicationContextValue = {
    personalInfo,
    setPersonalInfo: setPersonalInfoState,
    carInfo,
    setCarInfo: setCarInfoState,
    coverages,
    setCoverages: setCoveragesState,
    calculationTotals,
    setCalculationTotals: setCalculationTotalsState,
    financeDecision,
    setFinanceDecision: setFinanceDecisionState,
    resetApplication
  };

  return <InsuranceApplicationContext.Provider value={value}>{children}</InsuranceApplicationContext.Provider>;
};

export const useInsuranceApplication = () => {
  const ctx = useContext(InsuranceApplicationContext);
  if (!ctx) {
    throw new Error("useInsuranceApplication must be used within InsuranceApplicationProvider");
  }
  return ctx;
};

