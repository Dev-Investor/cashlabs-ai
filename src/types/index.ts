export type UserPlan = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL' | 'START' | 'PRO' | 'FUNDADOR';
export type UserLevel = 'Creador' | 'Desarrollador' | 'Vendedor' | 'Empresario' | 'Explorer' | 'Builder' | 'Agency Owner';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  country: string;
  experienceLevel: string;
  plan: UserPlan;
  aiIncomeScore: number;
  level: UserLevel;
  createdAt: number;
}

export interface DiagnosisResult {
  id: string;
  userId: string;
  userPlan: UserPlan;
  input: {
    experience: string;
    skills: string;
    time: string;
    capital: string;
    incomeGoal: string;
  };
  output: {
    level: string;
    aiIncomeScore: {
      score: number;
      level: string;
    };
    recommendedModel: string;
    offer: {
      niche: string;
      problem: string;
      valueProposition: string;
      promise: string;
      deliverables: string;
      price: string;
      priceJustification: string;
    };
    actionPlan: {
      week1: string;
      week2: string;
      week3: string;
      week4: string;
    };
    criticalNextStep: string;
    nextSteps: string[];
  };
  createdAt: number;
}
