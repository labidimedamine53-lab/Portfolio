import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  // React dev build uses eval() for stack-trace reconstruction.
  // Next.js HMR also uses eval. Production builds never need eval.
  isDev ? "'unsafe-eval'" : null,
  "https://va.vercel-scripts.com",
]
  .filter(Boolean)
  .join(" ");

const connectSrc = [
  "'self'",
  // Next dev HMR uses ws:// over localhost
  isDev ? "ws:" : null,
  isDev ? "http://localhost:*" : null,
  "https://vitals.vercel-insights.com",
  "https://va.vercel-scripts.com",
]
  .filter(Boolean)
  .join(" ");

const securityHeaders = [
  // Force HTTPS for two years; include subdomains; opt in to preload list
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Block MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow being iframed (defends against clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Modern equivalent of X-Frame-Options with CSP — narrowed below
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict powerful browser features we don't use
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  // Cross-origin isolation hints — minimal version, won't break Vercel Analytics
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // CSP — relatively strict but allows what Next + framer-motion + Vercel Analytics need
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      // framer-motion sets style attrs at runtime — needs 'unsafe-inline'
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      `connect-src ${connectSrc}`,
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      isDev ? null : "upgrade-insecure-requests",
    ]
      .filter(Boolean)
      .join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
