export const passwordRules = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
} as const;

export const passwordChecklist = [
  `At least ${passwordRules.minLength} characters`,
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
] as const;
