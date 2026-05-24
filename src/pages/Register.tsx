import { zodResolver } from "@hookform/resolvers/zod";
import { At, CircleNotch, Envelope } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  registerAccount,
  type AuthResponse,
} from "../features/auth/api/auth-client";
import PasswordField from "../features/auth/components/PasswordField";
import PasswordStrength from "../features/auth/components/PasswordStrength";
import TextField from "../features/auth/components/TextField";
import {
  registerDefaultValues,
  registerSchema,
  type RegisterFormValues,
} from "../features/auth/schemas/register-schema";

type RegisterPageProps = {
  onAuthenticated: (auth: AuthResponse) => void;
  onShowLogin: () => void;
};

export default function RegisterPage({
  onAuthenticated,
  onShowLogin,
}: RegisterPageProps) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: registerDefaultValues,
  });

  const passwordValue = useWatch({
    control,
    name: "password",
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");

    try {
      const result = await registerAccount({
        username: data.username,
        email: data.email,
        password: data.password,
      });

      reset();
      onAuthenticated(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setServerError(message);
    }
  };

  return (
    <section className="auth-view">
      <div className="auth-card-header">
        <p className="hero-kicker">register</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <TextField
          label="Username"
          id="username"
          icon={<At size={18} />}
          hint="Use letters, numbers, and underscores only."
          error={errors.username?.message}
          placeholder="cheater1337"
          autoComplete="username"
          {...register("username")}
        />

        <TextField
          label="Email address"
          id="email"
          icon={<Envelope size={18} />}
          error={errors.email?.message}
          placeholder="cheater@dma.com"
          autoComplete="email"
          {...register("email")}
        />

        <div className="auth-form-grid">
          <PasswordField
            label="Password"
            id="password"
            error={errors.password?.message}
            placeholder="Enter password"
            autoComplete="new-password"
            {...register("password")}
          />

          <PasswordField
            label="Confirm password"
            id="confirmPassword"
            error={errors.confirmPassword?.message}
            placeholder="Enter password again"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
        </div>

        <PasswordStrength password={passwordValue ?? ""} />

        {serverError && (
          <div className="form-alert form-alert-error" role="alert">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="ghost2-button"
        >
          {isSubmitting ? (
            <>
              <CircleNotch size={18} className="spin" /> Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="auth-switch-text">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onShowLogin}
            className="auth-switch-link"
          >
            Sign in
          </button>
        </p>
      </form>
    </section>
  );
}
