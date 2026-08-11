import { supabase } from "../../shared/clients/supabase";

export interface UpdateNegotiationOverviewInput {
  recoveryToken: string;
  name: string;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
}

export interface UpdateNegotiationOverviewResult {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
}

interface UpdateNegotiationOverviewRpcRow {
  negotiation_name: string | null;
  scene_date: string | null;
  scene_date_unknown: boolean;
  planned_activities: string;
}

function validate(
  input: UpdateNegotiationOverviewInput,
): void {
  const name = input.name.trim();
  const plannedActivities =
    input.plannedActivities.trim();

  if (!input.recoveryToken.trim()) {
    throw new Error(
      "Your secure login session is missing.",
    );
  }

  if (name.length > 120) {
    throw new Error(
      "Negotiation name cannot exceed 120 characters.",
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
      "Choose a planned scene date or select Not decided yet.",
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
}

export async function updateNegotiationOverview(
  input: UpdateNegotiationOverviewInput,
): Promise<UpdateNegotiationOverviewResult> {
  validate(input);

  const { data, error } = await supabase.rpc(
    "update_negotiation_overview",
    {
      p_recovery_token:
        input.recoveryToken.trim(),
      p_name:
        input.name.trim() || null,
      p_scene_date:
        input.sceneDateUnknown
          ? null
          : input.sceneDate,
      p_scene_date_unknown:
        input.sceneDateUnknown,
      p_planned_activities:
        input.plannedActivities.trim(),
    },
  );

  if (error) {
    console.error(
      "Unable to update negotiation overview:",
      error,
    );

    throw new Error(error.message);
  }

  const row = (
    data as UpdateNegotiationOverviewRpcRow[]
  )[0];

  if (!row) {
    throw new Error(
      "Supabase did not return the updated scene information.",
    );
  }

  return {
    negotiationName:
      row.negotiation_name ?? null,
    sceneDate:
      row.scene_date ?? null,
    sceneDateUnknown:
      Boolean(row.scene_date_unknown),
    plannedActivities:
      row.planned_activities,
  };
}