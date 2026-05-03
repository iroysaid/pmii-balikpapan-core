import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs"; 

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/masuk",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Username atau No Induk", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[AUTH DEBUG] Login attempt for identifier:", credentials?.identifier);
                
                if (!credentials?.identifier || !credentials?.password) {
                    console.log("[AUTH DEBUG] Missing credentials");
                    return null;
                }

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            OR: [
                                { username: credentials.identifier },
                                { kaderProfile: { noInduk: credentials.identifier } }
                            ]
                        },
                        include: {
                            kaderProfile: true
                        }
                    });

                    if (!user) {
                        console.log("[AUTH DEBUG] User not found:", credentials.identifier);
                        return null;
                    }

                    console.log("[AUTH DEBUG] Comparing passwords for:", credentials.identifier);
                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        console.log("[AUTH DEBUG] Invalid password for user:", credentials.identifier);
                        return null;
                    }

                    console.log("[AUTH DEBUG] Login successful for:", credentials.identifier);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        organizationId: user.organizationId,
                        mustChangePassword: user.mustChangePassword
                    };
                } catch (error) {
                    console.error("[AUTH DEBUG] Error in authorize callback:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.organizationId = token.organizationId as string | null | undefined;
                session.user.mustChangePassword = token.mustChangePassword as boolean | undefined;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // @ts-ignore - Extending token with custom properties
                token.id = user.id;
                // @ts-ignore
                token.role = user.role;
                // @ts-ignore
                token.organizationId = user.organizationId;
                // @ts-ignore
                token.mustChangePassword = user.mustChangePassword;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
