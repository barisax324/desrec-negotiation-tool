export type ParticipantRole = "A" | "B";

export interface ParticipantLabels {
  currentParticipant: "You";
  otherParticipant: "Scene Partner";
  leftColumn: "You" | "Scene Partner";
  rightColumn: "You" | "Scene Partner";
}

export function getParticipantLabels(
  currentRole: ParticipantRole,
): ParticipantLabels {
  return {
    currentParticipant: "You",
    otherParticipant: "Scene Partner",

    leftColumn:
      currentRole === "A" ? "You" : "Scene Partner",

    rightColumn:
      currentRole === "A" ? "Scene Partner" : "You",
  };
}

export function getRelativeParticipantLabel(
  recordRole: ParticipantRole,
  currentRole: ParticipantRole,
): "You" | "Scene Partner" {
  return recordRole === currentRole
    ? "You"
    : "Scene Partner";
}

export function isCurrentParticipant(
  recordRole: ParticipantRole,
  currentRole: ParticipantRole,
): boolean {
  return recordRole === currentRole;
}