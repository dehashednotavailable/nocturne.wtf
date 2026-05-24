import { passwordRules } from "../constants/password-rules";

export function getPasswordStrength(password: string) {
  if (!password) {
    return 0;
  }

  let score = 0;

  if (password.length >= passwordRules.minLength) {
    score += 1;
  }

  if (passwordRules.uppercase.test(password)) {
    score += 1;
  }

  if (passwordRules.lowercase.test(password)) {
    score += 1;
  }

  if (passwordRules.number.test(password)) {
    score += 1;
  }

  return score;
}

export function getPasswordStrengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
}
