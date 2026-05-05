import type { NextConfig } from "next";


const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        proxyClientMaxBodySize: '100mb',
        serverActions: {
            bodySizeLimit: '100mb',
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
                        // CSP: Allow PDFs (object-src), YouTube (frame/img), Google Maps (frame/img), and self-embedding (frame-ancestors)
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://img.youtube.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com; frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com https://maps.google.com; object-src 'self'; frame-ancestors 'self';",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
