import jwt from 'jsonwebtoken';
import { env } from '../../config';

interface TokenPayload {
  id: string;
  email: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (short-lived, 15 minutes)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',
    algorithm: 'HS256',
  });
};

/**
 * Generate refresh token (long-lived, 30 days)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256',
  });
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: TokenPayload): TokenResponse => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
