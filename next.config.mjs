const cspHeaderDev = `
  default-src 'self' *;
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
  connect-src 'self' *;
  img-src 'self' * data:;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline' *;
  frame-src 'self' *;
`;
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            // value: (isProd ? cspHeaderProd : cspHeaderDev).replace(/\n/g, ""),
            value: cspHeaderDev.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

// const cspHeader = `
//   default-src 'self';
//   script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 https://fr-photo-editor.vercel.app https://challenges.cloudflare.com https://upload-widget.cloudinary.com https://flowing-rattler-60.clerk.accounts.dev;
//   connect-src 'self' http://localhost:3000 https://fr-photo-editor.vercel.app https://flowing-rattler-60.clerk.accounts.dev ws://127.0.0.1:63597 wss://your-websocket-domain.com;
//   img-src 'self' https://img.clerk.com https://res.cloudinary.com data:;
//   worker-src 'self' blob:;
//   style-src 'self' 'unsafe-inline';
//   frame-src 'self' https://challenges.cloudflare.com https://upload-widget.cloudinary.com;
// `;

// const cspHeader = `
// default-src 'self' *;
// script-src 'self' 'unsafe-inline' 'unsafe-eval' *;
// connect-src 'self' *;
// img-src 'self' * data:;
// worker-src 'self' blob:;
// style-src 'self' 'unsafe-inline' *;
// frame-src 'self' *;
// `;
