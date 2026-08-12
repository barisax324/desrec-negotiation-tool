export async function hashReferenceId(
  referenceId: string,
): Promise<string> {
  const normalized = referenceId
    .trim()
    .toUpperCase();

  const encoded = new TextEncoder().encode(
    normalized,
  );

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      encoded,
    );

  return Array.from(
    new Uint8Array(hashBuffer),
  )
    .map((byte) =>
      byte.toString(16).padStart(2, "0"),
    )
    .join("");
}

