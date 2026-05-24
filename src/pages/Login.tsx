import { At, CircleNotch } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginAccount,
  type AuthResponse,
} from "../features/auth/api/auth-client";
import PasswordField from "../features/auth/components/PasswordField";
import TextField from "../features/auth/components/TextField";
import {
  loginDefaultValues,
  loginSchema,
  type LoginFormValues,
} from "../features/auth/schemas/login-schema";

type LoginPageProps = {
  onAuthenticated: (auth: AuthResponse) => void;
  onShowRegister: () => void;
};

export default function LoginPage({
  onAuthenticated,
  onShowRegister,
}: LoginPageProps) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: loginDefaultValues,
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    try {
      const result = await loginAccount({
        login: data.login,
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
        <p className="hero-kicker">login</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
        <TextField
          label="Username or email"
          id="login"
          icon={<At size={18} />}
          error={errors.login?.message}
          placeholder="cheater1337 or cheater@dma.com"
          autoComplete="username"
          {...register("login")}
        />

        <PasswordField
          label="Password"
          id="password"
          error={errors.password?.message}
          placeholder="Enter password"
          autoComplete="current-password"
          {...register("password")}
        />

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
              <CircleNotch size={18} className="spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="auth-switch-text">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onShowRegister}
            className="auth-switch-link"
          >
            Sign up
          </button>
        </p>
      </form>
    </section>
  );
}
