const API_BASE = "/api/kaelis";
const STORAGE_KEY = "kaelis.guest-session";
// The API supplies an opaque token with no expiry. This is a client retention policy.
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

type GuestSession = { token: string; expiresAt: number; guestId: string };

let pendingSession: Promise<string> | undefined;

function readSession(): GuestSession | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as GuestSession;
    if (
      typeof session?.token === "string" &&
      session.token.trim() &&
      typeof session.guestId === "string" && !!session.guestId.trim() &&
      Number.isFinite(session.expiresAt) &&
      session.expiresAt > Date.now()
    ) {
      return session;
    }
  } catch {
    // Discard malformed storage just like an expired session.
  }
  window.localStorage.removeItem(STORAGE_KEY);
  return null;
}

async function createSession(): Promise<string> {
  const response = await fetch(`${API_BASE}/user/anonymous`, {
    method: "POST",
    headers: { Accept: "application/json" },
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Guest authorization failed (${response.status})`);
  }

  const body = await response.json();
  if (
    body?.data?.token_type !== "Bearer" ||
    typeof body.data.access_token !== "string" ||
    !body.data.access_token.trim() ||
    !["string", "number"].includes(typeof body.data.guest?.id) ||
    !String(body.data.guest.id).trim()
  ) {
    throw new Error("Guest authorization returned an invalid token");
  }

  const session: GuestSession = {
    token: body.data.access_token,
    guestId: String(body.data.guest.id),
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session.token;
}

/** Browser-only. Shared by startup and API calls, including concurrent callers. */
export async function getGuestToken(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Guest authorization requires a browser");
  }
  const session = readSession();
  if (session) return session.token;

  if (!pendingSession) {
    const initialize = async () => readSession()?.token ?? createSession();
    // Also avoid creating two guests when multiple tabs open simultaneously.
    const initializeWithLock = async (): Promise<string> => {
      if (window.navigator?.locks) {
        return await window.navigator.locks.request(STORAGE_KEY, initialize);
      }
      return initialize();
    };
    pendingSession = initializeWithLock().finally(() => {
      pendingSession = undefined;
    });
  }
  return pendingSession;
}

export async function getGuestSession(): Promise<GuestSession> {
  await getGuestToken();
  const session = readSession();
  if (!session) throw new Error("Guest session unavailable");
  return session;
}

/** Relative Kaelis API paths only; returns the Response for the caller to handle. */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  if (!path.startsWith("/") || path.startsWith("//") || /[\\#]/.test(path)) {
    throw new Error("Expected a relative Kaelis API path");
  }
  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  if (!url.pathname.startsWith(`${API_BASE}/`)) {
    throw new Error("API path must stay within the Kaelis API");
  }
  const token = await getGuestToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${url.pathname}${url.search}`, {
    ...init,
    headers,
    credentials: "omit",
    cache: "no-store",
  });
  if (response.status === 401 && readSession()?.token === token) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  // Do not replay potentially mutating requests. The next call obtains a new token.
  return response;
}
