import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { sendLineNotify } from "../../../../lib/lineNotify";
import { sendEmailNotify } from "../../../../lib/lineNotify";
import UAParser from "ua-parser-js";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        await sendLineNotify(`User ${user.email} logged in`);
        await prisma.loginLog.create({
          data: {
            email: user.email!,
          },
        });
        await sendEmailNotify(
          process.env.ADMIN_EMAIL!,
          "New User Login",
          `User ${user.email} has just logged in.`,
        );
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      await mergeAnonymousCartIntoUserCart(user.id);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
