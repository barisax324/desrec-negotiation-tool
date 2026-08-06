import { supabase } from "../../lib/supabase";

export interface OpenNegotiationResult {
  participantRole: "A" | "B";
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string | null;
  retentionPeriod:
    | "24-hours"
    | "7-days"
    | "30-days";
  negotiationStatus: string;
  activatedAt: string | null;
  expiresAt: string | null;
  responses: Record<string, unknown>;
  responsesVersion: number;
  completedAt: string | null;
}

export type NegotiationAccessMode =
  | "permanent"
  | "recovery";

export async function openNegotiation(
  credential: string,
  accessMode: NegotiationAccessMode = "permanent",
): Promise<OpenNegotiationResult> {
  const cleanedCredential = credential.trim();

  if (!cleanedCredential) {
    throw new Error(
      accessMode === "recovery"
        ? "Missing recovery token."
        : "Missing access token.",
    );
  }

const { data, error } =
  accessMode === "recovery"
    ? await supabase.rpc(
        "open_negotiation_with_recovery_v2",
        {
          p_recovery_token:
            cleanedCredential,
        },
      )
    : await supabase.rpc(
        "open_negotiation_v2",
        {
          p_access_token:
            cleanedCredential,
        },
      );
      
  if (error) {
    console.error(
      "Unable to open negotiation:",
      error,
    );

    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Negotiation not found or has expired.",
    );
  }

  const row = data[0];

  const participantRole = String(
    row.participant_role,
  ).toUpperCase();

  if (
    participantRole !== "A" &&
    participantRole !== "B"
  ) {
    throw new Error(
      "The participant role could not be determined.",
    );
  }

  return {
    participantRole,
    negotiationName:
      row.negotiation_name ?? null,
    sceneDate:
      row.scene_date ?? null,
    sceneDateUnknown:
      Boolean(row.scene_date_unknown),
    plannedActivities:
      row.planned_activities ?? null,
    retentionPeriod:
      row.retention_period,
    negotiationStatus:
      row.negotiation_status,
    activatedAt:
      row.activated_at ?? null,
    expiresAt:
      row.expires_at ?? null,
    responses:
      row.responses ?? {},
    responsesVersion:
      row.responses_version ?? 0,
    completedAt:
      row.completed_at ?? null,
  };
}