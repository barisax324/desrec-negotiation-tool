import { supabase } from "@/shared/clients/supabase";

export interface ComparisonParticipantResponses {
  onboardingCompleted?: boolean;
  onboardingData?: unknown;
  sceneGoals?: unknown;
  activities?: unknown;
  healthSafety?: unknown;
  communication?: unknown;
  aftercare?: unknown;
  bodyMap?: unknown;
}

export interface NegotiationComparisonResult {
  publicId: string;
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  expiresAt: string | null;
  participantAComplete: boolean;
  participantBComplete: boolean;
  participantAResponses:
    | ComparisonParticipantResponses
    | null;
  participantBResponses:
    | ComparisonParticipantResponses
    | null;
}

interface ComparisonRow {
  public_id: string;
  negotiation_name: string | null;
  scene_date: string | null;
  scene_date_unknown: boolean;
  expires_at: string | null;
  participant_a_complete: boolean;
  participant_b_complete: boolean;
  participant_a_responses:
    | ComparisonParticipantResponses
    | null;
  participant_b_responses:
    | ComparisonParticipantResponses
    | null;
}

export async function getNegotiationComparison(
  recoveryToken: string,
): Promise<NegotiationComparisonResult> {
  const cleanedToken =
    recoveryToken.trim();

  if (!cleanedToken) {
    throw new Error(
      "Your secure login session is missing.",
    );
  }

  const { data, error } =
    await supabase.rpc(
      "get_negotiation_comparison",
      {
        p_recovery_token:
          cleanedToken,
      },
    );

  if (error) {
    console.error(
      "get_negotiation_comparison error:",
      error,
    );

    throw new Error(error.message);
  }

  const row =
    Array.isArray(data)
      ? (data[0] as
          | ComparisonRow
          | undefined)
      : undefined;

  if (!row) {
    throw new Error(
      "The negotiation comparison could not be found.",
    );
  }

  return {
    publicId: row.public_id,
    negotiationName:
      row.negotiation_name ?? null,
    sceneDate:
      row.scene_date ?? null,
    sceneDateUnknown:
      Boolean(
        row.scene_date_unknown,
      ),
    expiresAt:
      row.expires_at ?? null,
    participantAComplete:
      Boolean(
        row.participant_a_complete,
      ),
    participantBComplete:
      Boolean(
        row.participant_b_complete,
      ),
    participantAResponses:
      row.participant_a_responses ??
      null,
    participantBResponses:
      row.participant_b_responses ??
      null,
  };
}