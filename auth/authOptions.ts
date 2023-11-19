import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../prisma/client";
import { AuthOptions } from "next-auth";
import { Role } from "@prisma/client";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: user.id,
          },
        });
        // @ts-ignore
        token.role = dbUser?.role || Role.USER;
      }
      return token;
    },
    async session({ session }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: session.user.email!,
          },
        });
        // @ts-ignore
        session.user.role = dbUser?.role || Role.USER;
      }
      return session;
    },
  },
};

export default authOptions;
