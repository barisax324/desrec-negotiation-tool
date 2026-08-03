import { supabase } from "../../lib/supabase";

export interface JoinNegotiationResult {
  publicId: string;
  participantRole: "A" | "B";
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
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

export async function joinNegotiation(
  invitationToken: string,
): Promise<JoinNegotiationResult> {
  const token = invitationToken.trim();

  if (!token) {
    throw new Error(
      "Missing invitation token.",
    );
  }

  const { data, error } =
    await supabase.rpc(
      "join_negotiation",
      {
        p_invitation_token: token,
      },
    );

  if (error) {
    console.error(
      "join_negotiation RPC error:",
      error,
    );

    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "This invitation link is invalid, has already been used, or the negotiation has expired.",
    );
  }

  const row = data[0];

  const participantRole =
    String(
      row.participant_role,
    ).toUpperCase();

  if (participantRole !== "B") {
    throw new Error(
      "This is not a valid Participant B invitation link.",
    );
  }

  if (!row.public_id) {
    throw new Error(
      "The negotiation Reference ID was not returned.",
    );
  }

  return {
    publicId: row.public_id,
    participantRole,
    negotiationName:
      row.negotiation_name ?? null,
    sceneDate:
      row.scene_date ?? null,
    sceneDateUnknown:
      Boolean(row.scene_date_unknown),
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