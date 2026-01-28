import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Encrypts sensitive data using AES-256-GCM
 * Process: 
 * 1. Generate random IV
 * 2. Encrypt text
 * 3. Return IV + AuthTag + Ciphertext as a single hex string
 */
export function encrypt(text: string, secretKey: string): string {
  if (!secretKey) throw new Error("Encryption key not provided");

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authtag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts sensitive data
 */
export function decrypt(encryptedData: string, secretKey: string): string {
  if (!secretKey) throw new Error("Encryption key not provided");

  const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secretKey, 'hex'), iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Generates a random 32-byte (256-bit) key in hex for initial setup
 */
export function generateKey(): string {
  return crypto.randomBytes(32).toString('hex');
}
