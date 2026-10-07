This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy `.env.example` to `.env` in the project root and set
`NEXT_PUBLIC_BACKEND_ORIGIN` to the backend HTTP(S) origin without a path.
`.env` is ignored by Git; `.env.example` lists the required variable.

The backend origin is shared by Next.js rewrites and validation of WebSocket
authorization and answer URLs. It is public, embedded at build time, and is not
a secret. Restart the development server after editing it; rebuild for production.

Fixed API paths, the platform header, timeouts, guest session retention and the
Google Play link are defined in `src/lib/config/constants.ts`. Localized social
links are defined in `src/lib/config/social_links.ts`.

AI requests go through the backend. WebSocket host, key, port and TLS settings
come from `/configuration`. Private API or AI keys must stay on the backend,
never in `NEXT_PUBLIC_*` variables.

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Kaelis guest authorization

`GuestAuth` initializes the browser session on mount. `src/lib/api.ts` shares one
pending authorization request and reuses `kaelis.guest-session` in localStorage
(`token`, `expiresAt` in milliseconds). Web Locks also coordinate initialization
across tabs when supported. Storage must be available; storage/network failures
reject the call and a later API request can retry.

The [user.anonymous endpoint](https://stagtest.kaelisai.com/docs/api#/operations/user.anonymous)
is `POST /api/user/anonymous`, without a request body or authentication, using
`Accept: application/json`. The response contains `data.token_type` (`Bearer`),
`data.access_token`, and `data.guest`. Documentation specifies 200; the live server
also returns 201. Neither the documented response nor the observed opaque token
supplies an expiry. A **24-hour client retention policy** applies, without sliding
renewal; expired or malformed storage is removed on the next access.

Future browser requests should use `apiFetch("/endpoint", options)` from
`@/lib/api`. It obtains/reuses the token and adds `Authorization: Bearer …`.
A 401 clears the matching session; the next call renews it. Requests are not
automatically replayed, to avoid repeating mutations. No other endpoints are
implemented yet. Next.js rewrites `/api/kaelis/*` to the staging API so browser
requests use the site's origin despite the upstream CORS restriction.

Run the isolated authorization checks with `node --test tests/guest-auth.test.mjs`.
They mock fetch and localStorage and do not create real guests.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
