export interface SharedDetails {
  name: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string;
}

export interface EncryptedSharedDetails {
  ciphertext: string;
  iv: string;
  version: number;
}

export interface WrappedSharedKey {
  wrappedKey: string;
  iv: string;
  salt: string;
  version: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64(
  bytes: Uint8Array,
): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(
  value: string,
): Uint8Array<ArrayBuffer> {
  const binary = atob(value);

  const buffer =
    new ArrayBuffer(binary.length);

  const bytes =
    new Uint8Array(buffer);

  for (
    let index = 0;
    index < binary.length;
    index += 1
  ) {
    bytes[index] =
      binary.charCodeAt(index);
  }

  return bytes;
}

export async function generateSharedKey():
  Promise<string> {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );

  const raw = await crypto.subtle.exportKey(
    "raw",
    key,
  );

  return bytesToBase64(
    new Uint8Array(raw),
  );
}

async function importSharedKey(
  encodedKey: string,
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    base64ToBytes(encodedKey),
    {
      name: "AES-GCM",
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptJson(
  details: unknown,
  encodedKey: string,
): Promise<EncryptedSharedDetails> {
    const key =
    await importSharedKey(encodedKey);

  const iv = crypto.getRandomValues(
    new Uint8Array(12),
  );

  const plaintext = encoder.encode(
    JSON.stringify(details),
  );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      plaintext,
    );

  return {
    ciphertext: bytesToBase64(
      new Uint8Array(encrypted),
    ),
    iv: bytesToBase64(iv),
    version: 1,
  };
}

export async function decryptJson<T>(
  encrypted: EncryptedSharedDetails,
  encodedKey: string,
): Promise<T> {
    const key =
    await importSharedKey(encodedKey);

  const decrypted =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(encrypted.iv),
      },
      key,
      base64ToBytes(
        encrypted.ciphertext,
      ),
    );

return JSON.parse(
  decoder.decode(decrypted),
) as T;
}

export async function encryptSharedDetails(
  details: SharedDetails,
  encodedKey: string,
): Promise<EncryptedSharedDetails> {
  return encryptJson(
    details,
    encodedKey,
  );
}

export async function decryptSharedDetails(
  encrypted: EncryptedSharedDetails,
  encodedKey: string,
): Promise<SharedDetails> {
  return decryptJson<SharedDetails>(
    encrypted,
    encodedKey,
  );
}

async function derivePasswordKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
      const passwordMaterial =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 310000,
      hash: "SHA-256",
    },
    passwordMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function wrapSharedKey(
  encodedSharedKey: string,
  password: string,
): Promise<WrappedSharedKey> {
  const salt = crypto.getRandomValues(
    new Uint8Array(16),
  );

  const iv = crypto.getRandomValues(
    new Uint8Array(12),
  );

  const passwordKey =
    await derivePasswordKey(
      password,
      salt,
    );

  const wrapped =
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      passwordKey,
      encoder.encode(encodedSharedKey),
    );

  return {
    wrappedKey: bytesToBase64(
      new Uint8Array(wrapped),
    ),
    iv: bytesToBase64(iv),
    salt: bytesToBase64(salt),
    version: 1,
  };
}

export async function unwrapSharedKey(
  wrapped: WrappedSharedKey,
  password: string,
): Promise<string> {
  const passwordKey =
    await derivePasswordKey(
      password,
      base64ToBytes(wrapped.salt),
    );

  const decrypted =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToBytes(wrapped.iv),
      },
      passwordKey,
      base64ToBytes(
        wrapped.wrappedKey,
      ),
    );

  return decoder.decode(decrypted);
}

export function getStoredSharedKey():
  string {
  return (
    sessionStorage.getItem(
      "desrec.sharedKey",
    ) ?? ""
  );
}

export function storeSharedKey(
  key: string,
): void {
  sessionStorage.setItem(
    "desrec.sharedKey",
    key,
  );
}

export function extractSharedKeyFromUrl(
  urlValue: string,
): string {
  try {
    const url = new URL(
      urlValue,
      window.location.origin,
    );

    const sharedKey =
      new URLSearchParams(
        url.hash.slice(1),
      ).get("k") ?? "";

    if (
      sharedKey &&
      window.location.hash
    ) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    return sharedKey;
  } catch {
    return "";
  }
}

export function addSharedKeyToLink(
  link: string,
  key: string,
): string {
  const url = new URL(link);

  url.hash =
    `k=${encodeURIComponent(key)}`;

  return url.toString();
}