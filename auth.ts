import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

class InvalidCredentialsError extends CredentialsSignin {
  code = 'InvalidCredentialsError';
  constructor(message: string) {
    super(message);
  }
}

class InvalidOtpError extends CredentialsSignin {
  code = 'InvalidOtpError';
  constructor(message: string) {
    super(message);
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_MAX_AGE!),
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.expires_at = Math.floor(
          Date.now() / 1000 + parseInt(user.expiresIn),
        );
      }

      if (Date.now() < token.expires_at * 1000) {
        return token;
      }

      try {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token.refreshToken,
          },
        });

        if (!res.ok) throw Error();

        const refreshedTokens = (await res.json()).payload;

        if (!refreshedTokens) throw Error();

        return {
          ...token,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
          expires_at: Math.floor(
            Date.now() / 1000 + parseInt(refreshedTokens.expiresIn),
          ),
        };
      } catch (e) {
        return { ...token, error: 'RefreshAccessTokenError' as const };
      }

      return token;
    },
    session({ session, token }) {
      session.user.accessToken = token.accessToken;
      return session;
    },
  },
  providers: [
    Credentials({
      id: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (response.status == 400) {
          throw new InvalidCredentialsError('Invalid credentials');
        }

        const data = await response.json();
        const payload = data.payload;

        return payload;
      },
    }),
  ],
});
