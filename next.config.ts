import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Content-Security-Policy",
                        // CSP: Allow PDFs (object-src), YouTube (frame/img), and self-embedding (frame-ancestors)
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://img.youtube.com; frame-src 'self' https://www.youtube.com https://youtube.com; object-src 'self'; frame-ancestors 'self';",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
