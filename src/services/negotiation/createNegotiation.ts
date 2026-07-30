import { supabase } from "../../lib/supabase";

export type RetentionPeriod =
  | "24-hours"
  | "7-days"
  | "30-days";

export interface CreateNegotiationInput {
  name: string;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  retentionPeriod: RetentionPeriod;
  creatorPin: string;
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
  public_id: string;
  creator_token: string;
  invitation_token: string;
}

function validate(input: CreateNegotiationInput): void {
 const name = input.name.trim();

if (name.length > 120) {
  throw new Error(
    "Negotiation name cannot exceed 120 characters.",
  );
}

  if (
    input.retentionPeriod !== "24-hours" &&
    input.retentionPeriod !== "7-days" &&
    input.retentionPeriod !== "30-days"
  ) {
    throw new Error("Invalid retention period.");
  }

  if (input.sceneDateUnknown && input.sceneDate) {
    throw new Error(
      "Scene date must be empty when marked undecided.",
    );
  }

  if (!input.sceneDateUnknown && !input.sceneDate) {
    throw new Error("Scene date is required.");
  }

  if (!/^\d{6}$/.test(input.creatorPin)) {
    throw new Error(
      "Recovery PIN must contain exactly 6 digits.",
    );
  }
}

export async function createNegotiation(
  input: CreateNegotiationInput,
): Promise<CreateNegotiationResult> {
  validate(input);

  const { data, error } = await supabase.rpc(
    "create_negotiation",
    {
      p_name: input.name.trim(),
      p_scene_date: input.sceneDate,
      p_scene_date_unknown: input.sceneDateUnknown,
      p_retention_period: input.retentionPeriod,
      p_creator_pin: input.creatorPin,
    },
  );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const row = (data as CreateNegotiationRpcRow[])[0];

  if (!row) {
    throw new Error(
      "Supabase did not return negotiation information.",
    );
  }

  const origin = window.location.origin;

  return {
    negotiationId: row.negotiation_id,
    publicId: row.public_id,
    creatorToken: row.creator_token,
    invitationToken: row.invitation_token,

    personalLink:
      `${origin}/start?t=` +
      encodeURIComponent(row.creator_token),

    invitationLink:
      `${origin}/join?t=` +
      encodeURIComponent(row.invitation_token),
  };
}