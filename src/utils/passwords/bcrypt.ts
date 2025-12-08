import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hash password with bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
