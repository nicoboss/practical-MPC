export function encrypt_and_sign(jiff: any, message: number | string, encryption_public_key: Uint8Array, signing_private_key: Uint8Array): object;
export function decrypt_and_sign(jiff: any, cipher_text: object, decryption_secret_key: Uint8Array, signing_public_key: Uint8Array): number | string;
