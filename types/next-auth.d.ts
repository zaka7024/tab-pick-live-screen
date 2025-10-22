import { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    access_token: string;
    refresh_token?: string;
    expiresIn: string;
  }

  interface Session {
    user: {
      accessToken: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken?: string;
    expires_at: number;
    error?: string;
  }
}

