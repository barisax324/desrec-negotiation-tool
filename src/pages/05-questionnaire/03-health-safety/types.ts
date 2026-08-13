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

export type EmergencyContactAvailable =
  | "yes"
  | "no";

export interface HealthSafetyResponses {
  medicalConsiderations: SelectedOptionResponses;
  medicalInformation: MedicalInformation;
emergencyContactAvailable:
  | EmergencyContactAvailable
  | null;
    accessibilitySupport: SelectedOptionResponses;
  additionalSupportInformation: string;
}

