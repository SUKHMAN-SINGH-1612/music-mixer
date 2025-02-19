import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub; // Attach user ID
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url }) {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"; 
      return `${baseUrl}/dashboard`; // Redirect to dashboard after login
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page (optional)
  },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
