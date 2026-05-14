import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

const encoder = new TextEncoder();

type NetlifyGlobal = typeof globalThis & {
  Netlify?: {
    env?: {
      get?: (key: string) => string | undefined;
    };
  };
};

function readEnv(key: string) {
  const nodeValue =
    typeof process === "undefined" ? undefined : process.env[key]?.trim();

  return (
    (globalThis as NetlifyGlobal).Netlify?.env?.get?.(key)?.trim() ||
    nodeValue
  );
}

// Constant-time string comparison (Edge runtime has no node:crypto)
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  // Always compare the same number of bytes to avoid length-based timing leak
  const len = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

async function denyWithDelay(): Promise<NextResponse> {
  // Small artificial delay slows brute-force without harming legitimate users.
  // 350 ms means a single attacker can only try ~3/sec per connection, which combined
  // with the WWW-Authenticate browser prompt is enough to deter casual attacks.
  // Variability further frustrates timing-based oracle attacks.
  const jitter = 250 + Math.floor(Math.random() * 200);
  await new Promise((resolve) => setTimeout(resolve, jitter));
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
      "Cache-Control": "no-store",
    },
  });
}

export async function proxy(req: NextRequest) {
  const expectedUser = readEnv("ADMIN_USER");
  const expectedPass = readEnv("ADMIN_PASSWORD");

  if (!expectedUser || !expectedPass) {
    return new NextResponse("Admin disabled — set ADMIN_USER and ADMIN_PASSWORD.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return denyWithDelay();
  }

  let decoded = "";
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return denyWithDelay();
  }

  const idx = decoded.indexOf(":");
  if (idx === -1) return denyWithDelay();
  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  // Always run both comparisons to keep total time constant
  const userOk = timingSafeEqual(user, expectedUser);
  const passOk = timingSafeEqual(pass, expectedPass);
  if (!(userOk && passOk)) return denyWithDelay();

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
