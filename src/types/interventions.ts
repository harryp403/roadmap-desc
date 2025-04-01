export interface CostBreakdown {
  implementationCost: number;
  ongoingCostPEPM: number;
  ongoingCostFixed: number;
  oneTimeFixedFee: number;
}

export interface InterventionTimeline {
  implementationStartDate: Date;
  implementationEndDate: Date;
  ongoingStartDate: Date;
  ongoingEndDate: Date;
}

export interface Intervention {
  id: number;
  name: string;
  description: string;
  timeline: InterventionTimeline;
  costs: CostBreakdown;
  eligibleEmployees?: number;
}

export interface YearlyBudget {
  allocated: number;
  spent: number;
  isOverBudget: boolean;
} 