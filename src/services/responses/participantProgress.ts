import { supabase } from "@/shared/clients/supabase";

import {
  decryptJson,
  encryptJson,
  getStoredSharedKey,
} from "@/shared/crypto/sharedDetailsCrypto";

import type {
  ParticipantProgressResponses,
  ParticipantProgressRow,
  QuestionnairePage,
} from "@/app/negotiation-flow/types";

export async function getParticipantProgress(
  recoveryToken: string,
): Promise<ParticipantProgressRow | null> {
  const cleanedToken = recoveryToken.trim();

  if (!cleanedToken) {
    throw new Error(
      "Your secure login session is missing.",
    );
  }

  const { data, error } = await supabase.rpc(
    "get_participant_progress",
    {
      p_recovery_token: cleanedToken,
    },
  );

  if (error) {
    console.error(
      "get_participant_progress error:",
      error,
    );

    throw new Error(error.message);
  }

  if (!Array.isArray(data) || !data[0]) {
    return null;
  }

const row = data[0] as {
  current_page: QuestionnairePage;
  responses_ciphertext: string | null;
  responses_iv: string | null;
  responses_encryption_version: number | null;
  responses_version: number;
};

const sharedKey =
  getStoredSharedKey();

if (!sharedKey) {
  throw new Error(
    "Your negotiation encryption key is missing.",
  );
}

let responses:
  | ParticipantProgressResponses
  | null = null;

if (
  row.responses_ciphertext &&
  row.responses_iv &&
  row.responses_encryption_version
) {
  responses =
await decryptJson<ParticipantProgressResponses>(
        {
        ciphertext:
          row.responses_ciphertext,
        iv:
          row.responses_iv,
        version:
          row.responses_encryption_version,
      },
      sharedKey,
    );
}

return {
  current_page:
    row.current_page,
  responses,
  responses_version:
    row.responses_version,
} as ParticipantProgressRow;
}

interface SaveParticipantProgressInput {
  recoveryToken: string;
  currentPage: QuestionnairePage;
  responses: ParticipantProgressResponses;
}

export async function saveParticipantProgress({
  recoveryToken,
  currentPage,
  responses,
}: SaveParticipantProgressInput): Promise<void> {
  const cleanedToken = recoveryToken.trim();

  if (!cleanedToken) {
    throw new Error(
      "Your secure login session is missing.",
    );
  }

const sharedKey =
  getStoredSharedKey();

if (!sharedKey) {
  throw new Error(
    "Your negotiation encryption key is missing.",
  );
}

const encrypted =
  await encryptJson(
    responses,
    sharedKey,
  );

const { error } = await supabase.rpc(
  "save_participant_progress",
  {
    p_recovery_token:
      cleanedToken,

    p_current_page:
      currentPage,

    p_responses_ciphertext:
      encrypted.ciphertext,

    p_responses_iv:
      encrypted.iv,

    p_responses_encryption_version:
      encrypted.version,
  },
);

  if (error) {
    console.error(
      "save_participant_progress error:",
      error,
    );

    throw new Error(error.message);
  }
}

