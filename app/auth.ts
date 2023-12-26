import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

const emailOptions = {
  server: process.env.EMAIL_SERVER,
  from: process.env.EMAIL_FROM,
};

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [GitHub, Google, EmailProvider(emailOptions)],
  trustHost: true,
});
