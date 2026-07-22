export type QuestionType =
  | "text"
  | "textarea"
  | "yesNoMaybe"
  | "singleSelect"
  | "checkboxGroup"
  | "infoCard";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface NegotiationQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required?: boolean;
  allowNotes?: boolean;
  options?: QuestionOption[];
}

export interface NegotiationSection {
  id: string;
  title: string;
  description?: string;
  questions: NegotiationQuestion[];
}

export interface NegotiationTemplate {
  id: string;
  version: string;
  title: string;
  sections: NegotiationSection[];
}