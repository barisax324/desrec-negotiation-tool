import { supabase } from "@/shared/clients/supabase";

import {
  decryptJson,
  decryptSharedDetails,
  getStoredSharedKey,
} from "@/shared/crypto/sharedDetailsCrypto";

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
  shared_details_ciphertext: string;
  shared_details_iv: string;
  shared_details_version: number;
  expires_at: string | null;

  participant_a_complete: boolean;
  participant_b_complete: boolean;

  participant_a_responses_ciphertext:
    string | null;
  participant_a_responses_iv:
    string | null;
  participant_a_responses_encryption_version:
    number | null;

  participant_b_responses_ciphertext:
    string | null;
  participant_b_responses_iv:
    string | null;
  participant_b_responses_encryption_version:
    number | null;
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

  const sharedKey =
    getStoredSharedKey();

  if (!sharedKey) {
    throw new Error(
      "Your negotiation encryption key is missing.",
    );
  }

  const sharedDetails =
    await decryptSharedDetails(
      {
        ciphertext:
          row.shared_details_ciphertext,

        iv:
          row.shared_details_iv,

        version:
          row.shared_details_version,
      },
      sharedKey,
    );

  const participantAResponses =
    row.participant_a_responses_ciphertext &&
    row.participant_a_responses_iv &&
    row.participant_a_responses_encryption_version
      ? await decryptJson<ComparisonParticipantResponses>(
          {
            ciphertext:
              row.participant_a_responses_ciphertext,

            iv:
              row.participant_a_responses_iv,

            version:
              row.participant_a_responses_encryption_version,
          },
          sharedKey,
        )
      : null;

  const participantBResponses =
    row.participant_b_responses_ciphertext &&
    row.participant_b_responses_iv &&
    row.participant_b_responses_encryption_version
      ? await decryptJson<ComparisonParticipantResponses>(
          {
            ciphertext:
              row.participant_b_responses_ciphertext,

            iv:
              row.participant_b_responses_iv,

            version:
              row.participant_b_responses_encryption_version,
          },
          sharedKey,
        )
      : null;

  return {
    negotiationName:
      sharedDetails.name,

    sceneDate:
      sharedDetails.sceneDate,

    sceneDateUnknown:
      sharedDetails.sceneDateUnknown,

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
      participantAResponses,

    participantBResponses:
      participantBResponses,
  };
}