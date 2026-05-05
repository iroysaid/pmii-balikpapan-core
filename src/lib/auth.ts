import { NextAuthOptions } from "next-auth";
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
                if (!credentials?.identifier || !credentials?.password) {
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
                        return null;
                    }

                    const isPasswordValid = await compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        return null;
                    }

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
                // @ts-ignore
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
