import { useState, useEffect, useCallback } from "react";
import { WebAuthnContextType } from "./types";
import { base64ToBuffer, bufferToBase64 } from "#/utils/typesUtils";
import { getWebAuthnAvailability } from "#/utils/pwaUtils";

const LOCAL_STORAGE_KEY = "webauthn_credential_id";

const getLocalStorageKey = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

const setLocalStorageKey = (rawId: ArrayBuffer) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, bufferToBase64(rawId));
};

export const useWebAuthn = (): WebAuthnContextType => {
  const [isRegistered, setIsRegistered] = useState<boolean>(
    !!getLocalStorageKey()
  );
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isWebAuthnAvailable, setIsWebAuthnAvailable] = useState<boolean>();

  useEffect(() => {
    getWebAuthnAvailability()
      .then((res) => {
        setIsWebAuthnAvailable(res);
      })
      .catch((e) => {
        console.debug(e);
        setIsWebAuthnAvailable(false);
      });
  }, []);

  const register = useCallback(async (name: string, displayName: string) => {
    // В тестовом примере user.id генерируется на клиенте. В реальном приложении ID может быть получен из базы данных
    const userIdUUID = window.crypto.randomUUID();
    const userIdBuffer = new TextEncoder().encode(userIdUUID);

    const options: CredentialCreationOptions = {
      publicKey: {
        rp: {
          name: "PWA Example",
          id: window.location.hostname,
        },
        user: {
          id: userIdBuffer,
          name,
          displayName,
        },
        // В тестовом примере challenge генерируется на клиенте. В реальном приложении значение должно быть сгенерированно на сервере
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          residentKey: "required",
        },
        attestation: "direct",
      },
    };

    const credential = await navigator.credentials.create(options);
    if (credential instanceof PublicKeyCredential) {
      setLocalStorageKey(credential.rawId);
    }

    setIsRegistered(true);
  }, []);

  const login = useCallback(async () => {
    const credentialKey = getLocalStorageKey();
    if (!credentialKey) {
      return;
    }

    const options: CredentialRequestOptions = {
      publicKey: {
        // В тестовом примере challenge генерируется на клиенте. В реальном приложении значение должно быть сгенерированно на сервере
        challenge: window.crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [
          {
            id: base64ToBuffer(credentialKey),
            type: "public-key",
          },
        ],
      },
    };

    await navigator.credentials.get(options);

    setIsAuthorized(true);
  }, []);

  return {
    isRegistered,
    isAuthorized,
    isWebAuthnAvailable,
    register,
    login,
    continueWithourLogin: () => {
      setIsAuthorized(true);
    },
  };
};
