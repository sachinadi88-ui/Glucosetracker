
import { GlucoseLevel, MealStatus, RangeInfo } from './types';

export const getGlucoseLevel = (value: number, status: MealStatus): GlucoseLevel => {
  if (value < 70) return GlucoseLevel.HYPOGLYCEMIA;

  if (status === MealStatus.FASTING) {
    if (value < 100) return GlucoseLevel.NORMAL;
    if (value < 126) return GlucoseLevel.PREDIABETES;
    return GlucoseLevel.DIABETES;
  } else {
    // Post-prandial (After meal) or Random
    if (value < 140) return GlucoseLevel.NORMAL;
    if (value < 200) return GlucoseLevel.PREDIABETES;
    return GlucoseLevel.DIABETES;
  }
};

export const LEVEL_METADATA: Record<GlucoseLevel, RangeInfo> = {
  [GlucoseLevel.HYPOGLYCEMIA]: {
    min: 0,
    max: 69,
    label: 'Hypoglycemia',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    description: 'Blood sugar is dangerously low. Please consume fast-acting carbs and consult a doctor.'
  },
  [GlucoseLevel.NORMAL]: {
    min: 70,
    max: 99,
    label: 'Normal',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    description: 'Your blood sugar is within the healthy target range.'
  },
  [GlucoseLevel.PREDIABETES]: {
    min: 100,
    max: 125,
    label: 'Prediabetes',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    description: 'Values indicate a risk of developing Type 2 diabetes. Monitor closely.'
  },
  [GlucoseLevel.DIABETES]: {
    min: 126,
    max: null,
    label: 'Diabetes Range',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    description: 'Values are consistently high. Consultation with a healthcare provider is recommended.'
  }
};
