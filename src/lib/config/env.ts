function required(value: string | undefined, name: string): string {
  if (!value?.trim()) throw new Error(`Missing environment variable: ${name}`);
  return value.trim();
}

function backendOrigin(value: string | undefined): string {
  const url = new URL(required(value, "NEXT_PUBLIC_BACKEND_ORIGIN"));
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_BACKEND_ORIGIN must be an HTTP(S) origin without a path or credentials");
  }
  return url.origin;
}

export const BACKEND_ORIGIN = backendOrigin(process.env.NEXT_PUBLIC_BACKEND_ORIGIN);
