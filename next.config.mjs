/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;

// const cspHeader = `
//   default-src 'self';
//   script-src 'self' 'unsafe-inline' 'unsafe-eval' https://flowing-rattler-60.clerk.accounts.dev https://challenges.cloudflare.com https://upload-widget.cloudinary.com;
//   connect-src 'self' https://flowing-rattler-60.clerk.accounts.dev ws://127.0.0.1:63597 wss://your-websocket-domain.com;
//   img-src 'self' https://img.clerk.com https://res.cloudinary.com;
//   worker-src 'self' blob:;
//   style-src 'self' 'unsafe-inline';
//   frame-src 'self' https://challenges.cloudflare.com;
// `;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "Content-Security-Policy",
//             value: cspHeader.replace(/\n/g, ""),
//           },
//         ],
//       },
//     ];
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         port: "",
//       },
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//         port: "",
//       },
//     ],
//   },
// };

// export default nextConfig;
