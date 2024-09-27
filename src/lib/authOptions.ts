import { AppEnvs } from "./core/read-env";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  authenticateGoogleSignin,
  authenticateSignin,
  findMember,
} from "./actions";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: AppEnvs.GOOGLE_CLIENT_ID,
      clientSecret: AppEnvs.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await authenticateSignin(
          credentials.email,
          credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        if (profile && profile.email && account.refresh_token) {
          const authenticatedUser = await authenticateGoogleSignin(
            profile.email,
            account.refresh_token
          );
          if (authenticatedUser) {
            account.user = authenticatedUser;

            return true;
          }

          const preFillquery = new URLSearchParams({
            email: profile.email || "",
            name: profile.name || "",
          }).toString();
          return `/signup?${preFillquery}`;
        }
        return "/signup";
      } else if (account?.provider === "credentials") {
        if (user) {
          account.user = { id: Number(user.id), role: user.role };
          return true;
        }
        return false;
      }
      return false;
    },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.user.id;
        token.role = account.user.role;
      }

      return token;
    },

    async session({ session }) {
      if (session.user && session.user.email) {
        const member = await findMember(session.user.email);
        if (member) {
          session.user.id = member.id;
          session.user.role = member.role;
        }
      }

      return session;
    },
  },
};
