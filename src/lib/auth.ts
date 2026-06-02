import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/permissions/defaults";
import { getPermissionConfig } from "@/lib/permissions/service";
import { getRolePermissions } from "@/lib/permissions/routes";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: SESSION_MAX_AGE_SECONDS,
    },
    jwt: {
        maxAge: SESSION_MAX_AGE_SECONDS,
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
                        mustChangePassword: user.mustChangePassword,
                        hasKaderProfile: Boolean(user.kaderProfile),
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
                session.user.hasKaderProfile = token.hasKaderProfile as boolean | undefined;
                session.user.permissions = token.permissions;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.organizationId = user.organizationId;
                token.mustChangePassword = user.mustChangePassword;
                token.hasKaderProfile = user.hasKaderProfile;
            }

            if (token.role) {
                const permissionConfig = await getPermissionConfig();
                token.permissions = getRolePermissions(
                    token.role,
                    permissionConfig.roles
                );
            }

            return token;
        },
    },
};
