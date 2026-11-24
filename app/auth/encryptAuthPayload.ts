interface AuthEncryptionKeyResponse {
  publicKey?: string;
}

interface EncryptedAuthPayload {
  encryptedKey: string;
  iv: string;
  encryptedData: string;
}

let cachedRsaKey: { key: CryptoKey; expiresAt: number } | undefined;
let rsaKeyRequest: Promise<CryptoKey> | undefined;

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary);
};

const pemToBytes = (pem: string) => {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, "");
  const binary = window.atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

async function loadRsaKey(): Promise<CryptoKey> {
  const keyResponse = await fetch("/api/auth/encryption-key", { cache: "no-store" });
  if (!keyResponse.ok) {
    throw new Error(
      `Could not load the authentication encryption key (HTTP ${keyResponse.status}). ` +
      "Make sure the backend is running and reachable, then try again."
    );
  }

  const { publicKey } = (await keyResponse.json()) as AuthEncryptionKeyResponse;
  if (!publicKey) throw new Error("The authentication encryption key is unavailable.");

  return window.crypto.subtle.importKey(
    "spki",
    pemToBytes(publicKey),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );
}

async function getRsaKey(): Promise<CryptoKey> {
  if (cachedRsaKey && cachedRsaKey.expiresAt > Date.now()) {
    return cachedRsaKey.key;
  }
  if (!rsaKeyRequest) {
    rsaKeyRequest = loadRsaKey()
      .then((key) => {
        cachedRsaKey = { key, expiresAt: Date.now() + 5 * 60 * 1000 };
        return key;
      })
      .finally(() => {
        rsaKeyRequest = undefined;
      });
  }
  return rsaKeyRequest;
}

export async function prepareAuthEncryptionKey(): Promise<void> {
  await getRsaKey();
}

export async function encryptAuthPayload(
  payload: Record<string, string>
): Promise<EncryptedAuthPayload> {
  if (!window.isSecureContext || !window.crypto?.subtle) {
    throw new Error("Secure browser encryption requires HTTPS or localhost.");
  }

  const rsaKey = await getRsaKey();
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(JSON.stringify(payload));
  const [encryptedKey, encryptedData] = await Promise.all([
    window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, rsaKey, rawAesKey),
    window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, plaintext),
  ]);

  return {
    encryptedKey: toBase64(new Uint8Array(encryptedKey)),
    iv: toBase64(iv),
    encryptedData: toBase64(new Uint8Array(encryptedData)),
  };
}
