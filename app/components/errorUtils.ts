export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;

    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown error";
    }
  }

  return String(error);
}

export function toError(error: unknown) {
  return new Error(getErrorMessage(error));
}