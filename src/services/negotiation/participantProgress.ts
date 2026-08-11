import { supabase } from "../../shared/clients/supabase";

import type {
  ParticipantProgressResponses,
  ParticipantProgressRow,
  QuestionnairePage,
} from "../../app/negotiation-flow/types";

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

  return data[0] as ParticipantProgressRow;
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

  const { error } = await supabase.rpc(
    "save_participant_progress",
    {
      p_recovery_token: cleanedToken,
      p_current_page: currentPage,
      p_responses: responses,
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