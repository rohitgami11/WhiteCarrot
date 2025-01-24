import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { 
          prompt: "consent", 
          access_type: "offline", 
          response_type: "code",
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.readonly',
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ profile }) {
      // Simply return true to allow sign-in without additional checks
      return true;
    },

    // Optional: Customize the session callback if needed
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.accessToken = token.accessToken;  // Store the access token
      session.user.refreshToken = token.refreshToken;  // Store the refresh token
      return session;
    },
    async jwt({ token, account }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token; // Store the access token
        token.refreshToken = account.refresh_token; // Store the refresh token
        token.expires = account.expires_at;  // Store the token expiry time
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/signin", // Redirect here if not signed in
  },
});

export { handler as GET, handler as POST };
