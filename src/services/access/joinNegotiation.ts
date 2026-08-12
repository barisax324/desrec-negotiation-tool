import { supabase } from "@/shared/clients/supabase";

import {
  decryptJson,
  decryptSharedDetails,
  getStoredSharedKey,
} from "@/shared/crypto/sharedDetailsCrypto";

export interface JoinNegotiationResult {
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

const sharedKey =
  getStoredSharedKey();

if (!sharedKey) {
  throw new Error(
    "The invitation encryption key is missing.",
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

const responses =
  row.responses_ciphertext &&
  row.responses_iv &&
  row.responses_encryption_version
    ? await decryptJson<
        Record<string, unknown>
      >(
        {
          ciphertext:
            row.responses_ciphertext,

          iv:
            row.responses_iv,

          version:
            row.responses_encryption_version,
        },
        sharedKey,
      )
    : {};

const participantRole =
  String(
    row.participant_role,
  ).toUpperCase();

  if (participantRole !== "B") {
    throw new Error(
      "This is not a valid Participant B invitation link.",
    );
  }

  return {
    participantRole,
negotiationName:
  sharedDetails.name,
sceneDate:
  sharedDetails.sceneDate,
sceneDateUnknown:
  sharedDetails.sceneDateUnknown,
      retentionPeriod:
      row.retention_period,
    negotiationStatus:
      row.negotiation_status,
    activatedAt:
      row.activated_at ?? null,
    expiresAt:
      row.expires_at ?? null,
    responses,
    responsesVersion:
      row.responses_version ?? 0,
    completedAt:
      row.completed_at ?? null,
  };
}

