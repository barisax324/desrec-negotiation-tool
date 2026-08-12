import { supabase } from "@/shared/clients/supabase";

import { encryptSharedDetails, getStoredSharedKey,} from "@/shared/crypto/sharedDetailsCrypto";

import type {
  RetentionPeriod,
} from "@/services/creation/createNegotiation";

export interface UpdateNegotiationSetupInput {
  accessToken: string;
  name: string;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
  retentionPeriod: RetentionPeriod;
}

export interface UpdateNegotiationSetupResult {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
  retentionPeriod: RetentionPeriod;
  activatedAt: string;
  expiresAt: string;
}

interface UpdateNegotiationSetupRpcRow {
  shared_details_ciphertext: string;
  shared_details_iv: string;
  shared_details_version: number;
  retention_period: RetentionPeriod;
  activated_at: string;
  expires_at: string;
}

export async function updateNegotiationSetup(
  input: UpdateNegotiationSetupInput,
): Promise<UpdateNegotiationSetupResult> {
const sharedKey =
  getStoredSharedKey();

if (!sharedKey) {
  throw new Error(
    "Your negotiation encryption key is missing.",
  );
}

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
        "update_negotiation_setup",
{
p_access_token:
  input.accessToken.trim(),
  
  p_shared_details_ciphertext:
    encrypted.ciphertext,

  p_shared_details_iv:
    encrypted.iv,

  p_shared_details_version:
    encrypted.version,

  p_retention_period:
    input.retentionPeriod,
},
  );

  if (error) {
    console.error(
      "Unable to update negotiation setup:",
      error,
    );

    throw new Error(error.message);
  }

  const row = (
    data as UpdateNegotiationSetupRpcRow[]
  )[0];

  if (!row) {
    throw new Error(
      "Supabase did not return the updated negotiation information.",
    );
  }

return {
  negotiationName:
    input.name.trim() || null,

  sceneDate:
    input.sceneDateUnknown
      ? null
      : input.sceneDate,

  sceneDateUnknown:
    input.sceneDateUnknown,

  plannedActivities:
    input.plannedActivities.trim(),

  retentionPeriod:
    row.retention_period,

  activatedAt:
    row.activated_at,

  expiresAt:
    row.expires_at,
};
}

