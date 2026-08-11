import { useState } from "react";

import { updateNegotiationOverview } from "../../../services/negotiation/updateNegotiationOverview";

import type { NegotiationInfo } from "../types";

interface SaveOverviewValues {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
}

export function useNegotiationOverview(
  recoveryCredential: string,
) {
  const [
    negotiationInfo,
    setNegotiationInfo,
  ] = useState<NegotiationInfo>({
    negotiationName: null,
    sceneDate: null,
    sceneDateUnknown: false,
    plannedActivities: null,
  });

  const [
    isSavingOverview,
    setIsSavingOverview,
  ] = useState(false);

  const [
    overviewSaveError,
    setOverviewSaveError,
  ] = useState("");

  async function saveOverview(
    values: SaveOverviewValues,
  ): Promise<boolean> {
    if (!recoveryCredential) {
      setOverviewSaveError(
        "Your secure login session is missing. Please reopen the negotiation.",
      );

      return false;
    }

    setIsSavingOverview(true);
    setOverviewSaveError("");

    try {
      const updated =
        await updateNegotiationOverview({
          recoveryToken:
            recoveryCredential,
          name:
            values.negotiationName ?? "",
          sceneDate:
            values.sceneDate,
          sceneDateUnknown:
            values.sceneDateUnknown,
          plannedActivities:
            values.plannedActivities,
        });

      const updatedInfo: NegotiationInfo = {
        negotiationName:
          updated.negotiationName,
        sceneDate:
          updated.sceneDate,
        sceneDateUnknown:
          updated.sceneDateUnknown,
        plannedActivities:
          updated.plannedActivities,
      };

      setNegotiationInfo(updatedInfo);

      if (updated.negotiationName) {
        sessionStorage.setItem(
          "desrec.negotiationName",
          updated.negotiationName,
        );
      } else {
        sessionStorage.removeItem(
          "desrec.negotiationName",
        );
      }

      sessionStorage.setItem(
        "desrec.sceneDate",
        updated.sceneDate ?? "",
      );

      sessionStorage.setItem(
        "desrec.sceneDateUndecided",
        String(
          updated.sceneDateUnknown,
        ),
      );

      sessionStorage.setItem(
        "desrec.plannedActivities",
        updated.plannedActivities,
      );

      return true;
    } catch (error) {
      console.error(
        "Scene overview update failed:",
        error,
      );

      setOverviewSaveError(
        error instanceof Error
          ? error.message
          : "The scene details could not be saved.",
      );

      return false;
    } finally {
      setIsSavingOverview(false);
    }
  }

  return {
    negotiationInfo,
    setNegotiationInfo,
    isSavingOverview,
    overviewSaveError,
    saveOverview,
  };
}