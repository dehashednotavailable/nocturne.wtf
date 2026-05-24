export function getInputClassName(
  hasError: boolean,
  extraClassName?: string,
) {
  return ["form-input", hasError ? "is-error" : "", extraClassName]
    .filter(Boolean)
    .join(" ");
}
