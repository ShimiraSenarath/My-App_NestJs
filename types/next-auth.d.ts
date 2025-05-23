// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";


declare module "next-auth" {
  interface Session {
    user: {
      userId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    userId?: string;
  }
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      userId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    userId?: string;
  }
}
