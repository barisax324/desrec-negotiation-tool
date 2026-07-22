export type QuestionType =
  | "text"
  | "textarea"
  | "singleSelect"
  | "multiSelect"
  | "interestScale"
  | "slider"
  | "info";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface NegotiationQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  allowNotes: boolean;
  showInComparison: boolean;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface NegotiationSection {
  id: string;
  title: string;
  description: string;
  questions: NegotiationQuestion[];
}

export interface NegotiationTemplate {
  id: string;
  version: string;
  title: string;
  description: string;
  sections: NegotiationSection[];
}