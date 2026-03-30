export const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};
export const base64ToBuffer = (base64: string): ArrayBuffer => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};
