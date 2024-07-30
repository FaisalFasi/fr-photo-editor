// components/CSP.tsx
import Head from "next/head";

const CSP: React.FC = () => {
  const content = `
    default-src 'self' flowing-rattler-60.accounts.dev flowing-rattler-60.clerk.accounts.dev cdn.jsdelivr.net js.sentry-cdn.com browser.sentry-cdn.com *.ingest.sentry.io challenges.cloudflare.com scdn.clerk.com segapi.clerk.com;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.clerk.dev https://*.clerk.dev 'blob:' https://clerk.accounts.dev;
    connect-src 'self' https://*.clerk.dev;
    img-src 'self' data: https://*.clerk.dev;
    style-src 'self' 'unsafe-inline';
    font-src 'self' https://*.clerk.dev;
    frame-src https://*.clerk.dev;
  `;

  return (
    <Head>
      <meta httpEquiv="Content-Security-Policy" content={content} />
    </Head>
  );
};

export default CSP;
