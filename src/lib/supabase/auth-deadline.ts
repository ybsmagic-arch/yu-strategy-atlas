export const AUTH_TIMEOUT_MS = 5_000;

// Bound the whole SDK operation (including refresh/retries), not each retry.
export async function withAuthDeadline<T>(
  operation: (fetcher: typeof fetch, signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expired = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("Auth deadline exceeded"));
    }, AUTH_TIMEOUT_MS);
  });
  const fetcher: typeof fetch = (input, init) => {
    controller.signal.throwIfAborted();
    const original = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const signal = original
      ? AbortSignal.any([original, controller.signal])
      : controller.signal;
    return fetch(input, { ...init, signal });
  };
  try {
    return await Promise.race([operation(fetcher, controller.signal), expired]);
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
}
