import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
// import GitHub from "next-auth/providers/github";
// import Kakao from "next-auth/providers/kakao";

export const authConfig: NextAuthConfig = {
    session: { strategy: "jwt" },
    providers: [
        Google,
        // Enable these after configuring env values:
        // GitHub,
        // Kakao,
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.provider = account.provider;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = session.user.name ?? (token.name as string | undefined);
                session.user.email = session.user.email ?? (token.email as string | undefined);
                session.user.image = session.user.image ?? (token.picture as string | undefined);
            }
            // @ts-expect-error custom
            session.provider = token.provider;
            return session;
        },
    },
    pages: { signIn: "/" },
    debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
