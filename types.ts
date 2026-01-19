
export enum MealStatus {
  FASTING = 'FASTING',
  AFTER_MEAL = 'AFTER_MEAL',
  RANDOM = 'RANDOM'
}

export enum GlucoseLevel {
  HYPOGLYCEMIA = 'HYPOGLYCEMIA',
  NORMAL = 'NORMAL',
  PREDIABETES = 'PREDIABETES',
  DIABETES = 'DIABETES'
}

export interface GlucoseEntry {
  id: string;
  value: number;
  timestamp: Date;
  mealStatus: MealStatus;
  level: GlucoseLevel;
}

export interface RangeInfo {
  min: number;
  max: number | null;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}
