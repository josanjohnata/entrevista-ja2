export type PlanType = 'monthly' | 'quarterly' | 'yearly';

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  totalPrice: number;
  months: number;
  isPopular?: boolean;
  savings?: string;
  features: string[];
}
