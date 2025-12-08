import { prisma } from '../utils/database/prisma';
import { AppError } from '../utils/errors/AppError';
import {
  RegisterInput,
  LoginInput,
  RefreshInput,
  LogoutInput,
} from '../validators/auth.validator';
import { hashPassword, comparePassword } from '../utils/passwords/bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/tokens/jwt';
import { HTTP_STATUS_CODES } from '../constants';

const authService = {
  register: async (input: RegisterInput) => {
    const { email, password } = input;

    // Check if email already exists
    const existingEmail = await prisma.authAccount.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new AppError(
        'Email already registered',
        HTTP_STATUS_CODES.CONFLICT
      );
    }

    // Hash password with bcrypt (salt rounds: 12)
    const passwordHash = await hashPassword(password);

    // Create AuthAccount in database
    const authAccount = await prisma.authAccount.create({
      data: {
        email,
        password: passwordHash,
      },
    });

    // Generate JWT tokens (access + refresh)
    const tokens = generateTokens({
      id: authAccount.id,
      email: authAccount.email,
    });

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        authAccountId: authAccount.id,
        expiresAt,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      authAccount: {
        id: authAccount.id,
        email: authAccount.email,
      },
    };
  },

  login: async (input: LoginInput) => {
    const { email, password } = input;

    // Find account by email
    const authAccount = await prisma.authAccount.findUnique({
      where: { email },
    });

    if (!authAccount) {
      throw new AppError(
        'Invalid email or password',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      password,
      authAccount.password || ''
    );

    if (!isPasswordValid) {
      throw new AppError(
        'Invalid email or password',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Generate JWT tokens (access + refresh)
    const tokens = generateTokens({
      id: authAccount.id,
      email: authAccount.email,
    });

    // Store refresh token in database
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        authAccountId: authAccount.id,
        expiresAt,
      },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      authAccount: {
        id: authAccount.id,
        email: authAccount.email,
      },
    };
  },

  refresh: async (input: RefreshInput) => {
    const { refreshToken } = input;

    // Find the refresh token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { authAccount: true },
    });

    if (!tokenRecord || !tokenRecord.authAccount) {
      throw new AppError(
        'Invalid refresh token',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Check if token is revoked
    if (tokenRecord.isRevoked) {
      throw new AppError(
        'Refresh token has been revoked',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Check if token is expired
    if (tokenRecord.expiresAt < new Date()) {
      throw new AppError(
        'Refresh token has expired',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Verify JWT signature
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(
        'Invalid refresh token',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Generate new access token
    const newAccessToken = generateTokens({
      id: tokenRecord.authAccount.id,
      email: tokenRecord.authAccount.email,
    }).accessToken;

    return {
      accessToken: newAccessToken,
    };
  },

  logout: async (input: LogoutInput) => {
    const { refreshToken } = input;

    // Find the refresh token in database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord) {
      throw new AppError(
        'Invalid refresh token',
        HTTP_STATUS_CODES.UNAUTHORIZED
      );
    }

    // Mark token as revoked
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });

    return { success: true };
  },
};

export default authService;
