export interface SelectableOption {
  id: string;
  label: string;
}

export interface SelectedOptionResponse {
  selected: boolean;
  notes: string;
}

export type SelectedOptionResponses = Record<
  string,
  SelectedOptionResponse
>;

export interface MedicalInformation {
  allergies: string;
  medications: string;
  conditions: string;
  additionalInformation: string;
}

export interface EmergencyInformation {
  name: string;
  relationship: string;
  phone: string;
  instructions: string;
}

export interface HealthSafetyResponses {
  medicalConsiderations: SelectedOptionResponses;
  medicalInformation: MedicalInformation;
  emergencyInformation: EmergencyInformation;
  accessibilitySupport: SelectedOptionResponses;
  additionalSupportInformation: string;
}

