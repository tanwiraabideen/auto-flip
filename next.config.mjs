/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingIncludes: {
            '/**/*': ['./node_modules/@sparticuz/chromium/**/*'],
        },
        serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
    },
};

export default nextConfig;