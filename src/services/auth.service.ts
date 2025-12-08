import { prisma } from '../utils/database/prisma';
import { AppError } from '../utils/errors/AppError';
import { RegisterInput } from '../validators/auth.validator';

const authService = {
  register: async (input: RegisterInput) => {
    const { email, password: _password } = input;
    // _password will be used with bcrypt.hash() in the next step

    // Check if email already exists
    const existingEmail = await prisma.authAccount.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password (TODO: use bcrypt)
    // const passwordHash = await bcrypt.hash(password, 10);

    // TODO: Create AuthAccount in database

    // TODO: Create RefreshToken entry

    // TODO: Generate JWT tokens

    // TODO: Return tokens and user data
    return {
      accessToken: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      authAccount: {
        id: 'demo_id',
        email,
      },
    };
  },
};

export default authService;
