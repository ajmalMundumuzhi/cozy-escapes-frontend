
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check your connection and try again."
    );
  }

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    const error = new Error(
      result?.error?.message || "The request could not be completed."
    );

    error.status = response.status;
    error.code = result?.error?.code || "REQUEST_FAILED";
    error.fields = result?.error?.fields || undefined;

    throw error;
  }

  return result;
}
