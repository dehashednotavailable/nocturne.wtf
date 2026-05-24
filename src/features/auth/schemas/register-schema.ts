import { z } from "zod";
import { passwordRules } from "../constants/password-rules";

const passwordSchema = z
  .string()
  .min(
    passwordRules.minLength,
    `Password must contain at least ${passwordRules.minLength} characters.`,
  )
  .regex(
    passwordRules.uppercase,
    "Password must include at least one uppercase letter.",
  )
  .regex(
    passwordRules.lowercase,
    "Password must include at least one lowercase letter.",
  )
  .regex(passwordRules.number, "Password must include at least one number.");

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must contain at least 3 characters.")
      .max(20, "Username must be no longer than 20 characters.")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can contain only letters, numbers, and underscores.",
      ),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};
