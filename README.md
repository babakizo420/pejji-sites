# Pejji Sites

Monorepo for [Pejji](https://pejji.com) — a security-first web agency based in Lagos, Nigeria.

## What's Inside

| Folder | Description |
|---|---|
| `pejji-com/` | Main agency site (pejji.com) |
| `exports/extracted/kachi-barber-card-tier/` | Card tier demo — kachi.pejji.com |
| `exports/extracted/swiftdrop-starter-tier/` | Starter tier demo — swiftdrop-demo.pejji.com |
| `exports/extracted/glowup-beauty-growth-tier/` | Growth tier demo — glowup-demo.pejji.com |
| `exports/extracted/ade-co-pro-tier/` | Pro tier demo — ade-demo.pejji.com |
| `tools/` | Internal tools (partner image generator) |
| `scripts/` | Security check scripts |

## Stack

- **Framework:** Astro 4 + React islands
- **Styling:** Tailwind CSS
- **Animations:** Motion (framer-motion)
- **Deployment:** Cloudflare Pages
- **Forms:** Web3Forms + Cloudflare Turnstile
- **Analytics:** GA4

## CI/CD Pipeline

Every push runs through a 5-stage pipeline:

1. **Code Quality** — secret scanning, lint
2. **Build Verification** — compile + output check
3. **Security Check** — dependency audit, header verification, info disclosure scan
4. **Performance Check** — build size, image optimization
5. **Deploy Gate** — Cloudflare Pages auto-deploy on main

Branch protection enforced on `main` — all 4 checks must pass before merge.

## Security

- Security headers on every site (CSP, HSTS, X-Frame-Options, etc.)
- Monthly automated security scans
- Cloudflare Turnstile on contact form
- Rate limiting active
- `/.well-known/security.txt` published
- SPF, DKIM, DMARC configured for email

## License

Proprietary. All rights reserved.
