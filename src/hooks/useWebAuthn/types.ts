export interface WebAuthnContextType {
  isRegistered: boolean;
  isAuthorized: boolean;
  isWebAuthnAvailable: boolean | undefined;
  register: (name: string, displayName: string) => Promise<void>;
  login: () => Promise<void>;
  continueWithourLogin: () => void;
}
