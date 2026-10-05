export function stringify(
  query?: Record<string, string | number | boolean | null | undefined | unknown>
): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  }
  return params.toString();
}

const qs = { stringify };

export default qs;
