import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import Google from "next-auth/providers/google";
import { encrypt } from "@/lib/crypto";
import { rateLimit } from "@/lib/rateLimit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),

    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const { success } = rateLimit(email,5,120_000) 
        if (!success) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) return null;
        if (!user.password) return null;

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.id = user.id;

      if (account && account.provider === "google") {
        token.provider = account.provider;

        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: token.email!,
                name: token.name ?? "Usuário",
                password: null,
              },
            });
          }

          token.id = dbUser.id;

          if (account.access_token) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                accessToken: encrypt(account.access_token),
                refreshToken: account.refresh_token ? encrypt(account.access_token): null,
                tokenExpiry: account.expires_at
                  ? new Date(account.expires_at * 1000)
                  : null,
              },
            });
          }
        } catch (e) {
          console.error("JWT callback error:", e);
        }
      }

      if (account && account.provider === "credentials") {
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
  },
});