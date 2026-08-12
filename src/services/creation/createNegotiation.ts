import { supabase } from "@/shared/clients/supabase";
import { createReferenceId } from "./createReferenceId";

import {
  addSharedKeyToLink,
  encryptSharedDetails,
  generateSharedKey,
  storeSharedKey,
} from "@/shared/crypto/sharedDetailsCrypto";

export type RetentionPeriod =
  | "24-hours"
  | "7-days"
  | "30-days";

export interface CreateNegotiationInput {
  name: string;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
  retentionPeriod: RetentionPeriod;
}

export interface CreateNegotiationResult {
  negotiationId: string;
  publicId: string;
  creatorToken: string;
  invitationToken: string;
  personalLink: string;
  invitationLink: string;
}

interface CreateNegotiationRpcRow {
  negotiation_id: string;
  creator_token: string;
  invitation_token: string;
}

function validate(
  input: CreateNegotiationInput,
): void {
  const name = input.name.trim();
  const plannedActivities =
    input.plannedActivities.trim();

  if (name.length > 120) {
    throw new Error(
      "Negotiation name cannot exceed 120 characters.",
    );
  }

  if (!plannedActivities) {
    throw new Error(
      "Planned scene activities are required.",
    );
  }

  if (plannedActivities.length > 500) {
    throw new Error(
      "Planned scene activities cannot exceed 500 characters.",
    );
  }

  if (
    input.retentionPeriod !== "24-hours" &&
    input.retentionPeriod !== "7-days" &&
    input.retentionPeriod !== "30-days"
  ) {
    throw new Error(
      "Invalid retention period.",
    );
  }

  if (
    input.sceneDateUnknown &&
    input.sceneDate
  ) {
    throw new Error(
      "Scene date must be empty when marked undecided.",
    );
  }

  if (
    !input.sceneDateUnknown &&
    !input.sceneDate
  ) {
    throw new Error(
      "Scene date is required.",
    );
  }
}

export async function createNegotiation(
  input: CreateNegotiationInput,
): Promise<CreateNegotiationResult> {
  validate(input);

  const {
    referenceId,
    referenceIdHash,
  } = await createReferenceId();

  const sharedKey =
    await generateSharedKey();

  const encrypted =
    await encryptSharedDetails(
      {
        name:
          input.name.trim() || null,

        sceneDate:
          input.sceneDateUnknown
            ? null
            : input.sceneDate,

        sceneDateUnknown:
          input.sceneDateUnknown,

        plannedActivities:
          input.plannedActivities.trim(),
      },
      sharedKey,
    );

  const { data, error } =
    await supabase.rpc(
      "create_negotiation",
      {
        p_retention_period:
          input.retentionPeriod,

        p_reference_id_hash:
          referenceIdHash,

        p_shared_details_ciphertext:
          encrypted.ciphertext,

        p_shared_details_iv:
          encrypted.iv,

        p_shared_details_version:
          encrypted.version,
      },
    );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const row =
    (
      data as CreateNegotiationRpcRow[]
    )[0];

  if (!row) {
    throw new Error(
      "Supabase did not return negotiation information.",
    );
  }

  storeSharedKey(sharedKey);

  const origin =
    window.location.origin;

  const personalLink =
    addSharedKeyToLink(
      `${origin}/start?t=${encodeURIComponent(
        row.creator_token,
      )}`,
      sharedKey,
    );

  const invitationLink =
    addSharedKeyToLink(
      `${origin}/join?t=${encodeURIComponent(
        row.invitation_token,
      )}&ref=${encodeURIComponent(
        referenceId,
      )}`,
      sharedKey,
    );

  return {
    negotiationId:
      row.negotiation_id,

    publicId:
      referenceId,

    creatorToken:
      row.creator_token,

    invitationToken:
      row.invitation_token,

    personalLink,
    invitationLink,
  };
}