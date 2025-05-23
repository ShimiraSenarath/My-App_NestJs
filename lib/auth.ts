import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from './mongodb';
import type { Session} from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userId: { label: "User ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
      
        const client = await clientPromise;
        const db = client.db();
        const user = await db.collection('users').findOne({
          userId: credentials.userId,
          password: credentials.password,
        });
      
        if (!user) return null;
      
        return {
          id: user._id.toString(),
          email: user.email || "",
        };
      }
      
    })
  ],
  callbacks: {
    async session({ session }: { session: Session }) {
      const client = await clientPromise;
      const db = client.db();
      const user = await db.collection("users").findOne({
        email: session.user.email,
      });
  
      if (user) {
        session.user.userId = user.userId;
      }
  
      return session;
    },
  }
};
