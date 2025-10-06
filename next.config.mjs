/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: [
            'puppeteer-extra',
            'puppeteer-extra-plugin-stealth',
        ],
    },
};

// Change this line from module.exports
export default nextConfig;