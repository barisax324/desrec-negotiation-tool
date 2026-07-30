import { supabase } from "../../lib/supabase";

export interface OpenNegotiationResult {
  participantRole: "A" | "B";
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  retentionPeriod: "24-hours" | "7-days" | "30-days";
  negotiationStatus: string;
  activatedAt: string | null;
  expiresAt: string | null;
  responses: Record<string, unknown>;
  responsesVersion: number;
  completedAt: string | null;
}

export async function openNegotiation(
  accessToken: string,
): Promise<OpenNegotiationResult> {
  const token = accessToken.trim();

  if (!token) {
    throw new Error("Missing access token.");
  }

  const { data, error } = await supabase.rpc(
    "open_negotiation",
    {
      p_access_token: token,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Negotiation not found or has expired.",
    );
  }

  const row = data[0];

  return {
    participantRole: row.participant_role,
    negotiationName: row.negotiation_name,
    sceneDate: row.scene_date,
    sceneDateUnknown: row.scene_date_unknown,
    retentionPeriod: row.retention_period,
    negotiationStatus: row.negotiation_status,
    activatedAt: row.activated_at,
    expiresAt: row.expires_at,
    responses: row.responses ?? {},
    responsesVersion:
      row.responses_version ?? 0,
    completedAt: row.completed_at,
  };
}