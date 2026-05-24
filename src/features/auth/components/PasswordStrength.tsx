import { passwordChecklist } from "../constants/password-rules";
import {
  getPasswordStrength,
  getPasswordStrengthLabel,
} from "../utils/password-strength";

type PasswordStrengthProps = {
  password: string;
};

export default function PasswordStrength({
  password,
}: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);
  const label = password ? getPasswordStrengthLabel(strength) : "Not set";
  const strengthLevelClass = strength > 0 ? `strength-level-${strength}` : "";

  return (
    <section
      className={`password-strength-card ${strengthLevelClass}`.trim()}
      aria-label="Password strength"
    >
      <div className="password-strength-header">
        <span className="password-strength-title">Password strength</span>
        <span className="password-strength-label">{label}</span>
      </div>

      <div className="password-strength-bars">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`strength-bar${
              strength >= step ? " strength-bar-active" : ""
            }`}
          />
        ))}
      </div>

      <ul className="password-rules">
        {passwordChecklist.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    </section>
  );
}
