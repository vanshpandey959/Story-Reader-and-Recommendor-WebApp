import { z } from "zod";

const email = z.string({ required_error: "Email is required" }).trim().toLowerCase().email("Please enter a valid email");
const password = z.string({ required_error: "Password is required" });

export const signupSchema = z.object({
  name: z.string({ required_error: "Name is required" }).trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  email,
  password: password.min(6, "Password must be at least 6 characters").max(72, "Password is too long"),
});

export const loginSchema = z.object({
  email,
  password: password.min(1, "Password is required"),
});
