export interface CreatedReferenceId {
  referenceId: string;
  referenceIdHash: string;
}

function randomHex(length: number): string {
  const bytesNeeded = Math.ceil(length / 2);
  const bytes = crypto.getRandomValues(
    new Uint8Array(bytesNeeded),
  );

  return Array.from(bytes)
    .map((byte) =>
      byte.toString(16).padStart(2, "0"),
    )
    .join("")
    .slice(0, length)
    .toUpperCase();
}

export async function createReferenceId(): Promise<CreatedReferenceId> {
  const referenceId =
    `${randomHex(5)}-${randomHex(5)}`;

  const encoded = new TextEncoder().encode(
    referenceId,
  );

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      encoded,
    );

  const referenceIdHash = Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte.toString(16).padStart(2, "0"),
    )
    .join("");

  return {
    referenceId,
    referenceIdHash,
  };
}

