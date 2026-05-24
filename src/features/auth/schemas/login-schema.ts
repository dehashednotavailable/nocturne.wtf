import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().trim().min(3, "Enter your username or email."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  login: "",
  password: "",
};
