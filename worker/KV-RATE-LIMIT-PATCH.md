# vein.pejji.com Worker — KV Rate Limit Patch

Drop-in patch for the existing hardened Worker on `vein.pejji.com`. Adds IP-based rate limiting backed by Cloudflare KV. Safe for low-traffic endpoints (contact form, lead logger). The Worker source lives on Cloudflare only; this doc is a paste-into-dashboard patch, not a replacement file.

## What this stops

- Brute-force form spam from a single IP
- Accidental client-side loops hammering the endpoint
- Low-budget abuse (bots without rotating proxies)

Not sufficient for distributed abuse. For that, add Turnstile (already live) plus Cloudflare WAF rules on the custom hostname.

## Limits to apply

- **Per-IP**: 10 requests per 60 seconds
- **Global** (optional safety net): 600 requests per 60 seconds
- **Response on block**: HTTP 429 with `Retry-After` header and generic body

Tune these numbers in the constants block if the real traffic pattern shows different norms.

## Step 1 — Create the KV namespace

Run locally with wrangler, or use the Cloudflare dashboard:

### Option A: wrangler CLI
```
npx wrangler kv:namespace create RATE_LIMIT_KV
```

Copy the returned `id` and `preview_id` into your wrangler config.

### Option B: Cloudflare dashboard
1. Dashboard -> Workers & Pages -> KV
2. Create namespace, name it `vein-rate-limit`
3. Copy the namespace ID
4. Dashboard -> Workers -> `vein` (the Worker) -> Settings -> Variables -> KV Namespace Bindings
5. Add binding: Variable name `RATE_LIMIT_KV`, Namespace `vein-rate-limit`
6. Save and deploy

## Step 2 — Add the rate limiter to the Worker

Paste this helper near the top of the Worker file, after imports and before `export default`:

```js
const RATE_LIMIT_PER_IP = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_GLOBAL = 600;

async function rateLimit(request, env) {
  if (!env.RATE_LIMIT_KV) {
    return { allowed: true, reason: "kv-unbound" };
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / RATE_LIMIT_WINDOW_SECONDS);

  const ipKey = `rl:ip:${ip}:${bucket}`;
  const globalKey = `rl:global:${bucket}`;

  const [ipRaw, globalRaw] = await Promise.all([
    env.RATE_LIMIT_KV.get(ipKey),
    env.RATE_LIMIT_KV.get(globalKey),
  ]);

  const ipCount = parseInt(ipRaw || "0", 10);
  const globalCount = parseInt(globalRaw || "0", 10);

  if (ipCount >= RATE_LIMIT_PER_IP) {
    const retryAfter = RATE_LIMIT_WINDOW_SECONDS - (now % RATE_LIMIT_WINDOW_SECONDS);
    return { allowed: false, retryAfter, reason: "ip-limit" };
  }

  if (globalCount >= RATE_LIMIT_GLOBAL) {
    const retryAfter = RATE_LIMIT_WINDOW_SECONDS - (now % RATE_LIMIT_WINDOW_SECONDS);
    return { allowed: false, retryAfter, reason: "global-limit" };
  }

  const ttl = RATE_LIMIT_WINDOW_SECONDS * 2;
  await Promise.all([
    env.RATE_LIMIT_KV.put(ipKey, String(ipCount + 1), { expirationTtl: ttl }),
    env.RATE_LIMIT_KV.put(globalKey, String(globalCount + 1), { expirationTtl: ttl }),
  ]);

  return { allowed: true };
}
```

## Step 3 — Call the limiter at the start of the POST handler

Inside the existing `fetch(request, env, ctx)` function, after the origin/method checks but **before** the Turnstile verify and Notion call, add:

```js
const rl = await rateLimit(request, env);
if (!rl.allowed) {
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    {
      status: 429,
      headers: {
        ...CORS_HEADERS,
        "Retry-After": String(rl.retryAfter || 60),
      },
    }
  );
}
```

Keep the error body generic. Don't leak `reason` to the client; it's only useful for logs.

## Step 4 — Deploy

- **Dashboard edit**: Quick Edit -> paste -> Save and Deploy
- **wrangler CLI**: `npx wrangler deploy`

## Step 5 — Smoke test

From your local machine, hammer the endpoint 15 times in a row:

```
for i in $(seq 1 15); do curl -s -o /dev/null -w "req $i: %{http_code}\n" -X POST https://vein.pejji.com/log-lead -H "Content-Type: application/json" -d '{"business_name":"rate-limit-test"}'; done
```

Expected: first 10 return 400 (missing Turnstile/fields, that's fine), request 11+ return **429**. After 60 seconds the window resets.

If the block never triggers: KV binding is probably missing. Check `Variable name` is exactly `RATE_LIMIT_KV` and the binding is on the Worker, not a Pages project.

## Design notes

- **Eventually-consistent KV**: under a burst of concurrent requests, counts can under-count briefly. For a contact form that's fine; we're blocking abuse, not enforcing banking-grade limits. If you need strict per-request consistency use Durable Objects.
- **Fixed window**: a burster can hit the limit twice across a window boundary (20 reqs in 2s). Fine for anti-spam. Switch to sliding window if that matters.
- **IP spoofing**: CF-Connecting-IP is set by Cloudflare and cannot be overridden by clients. Safe to trust.
- **Blocked IPs**: the 2x TTL (120s) on KV keys means a spammer staying at their cap sees rolling blocks. Keys self-expire, no cleanup needed.

## What to remove when applied

Once deployed and tested, delete the `vein.pejji.com Worker hardening pending` line from `MEMORY.md` and mark the corresponding task in the Day 8 list as done.
