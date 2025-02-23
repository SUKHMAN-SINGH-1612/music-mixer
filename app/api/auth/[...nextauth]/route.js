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
    async jwt({ token, user }) {
      if (user) {
        // Call the API to save user data
        try {
          const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          const response = await fetch(`${baseUrl}/api/supabase/save-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              google_id: user.id,
              email: user.email,
              name: user.name,
            }),
          });

          if (!response.ok) {
            console.error("Failed to save user:", await response.json());
          }
        } catch (error) {
          console.error("Error saving user:", error);
        }

        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // Attach user ID
      return session;
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
