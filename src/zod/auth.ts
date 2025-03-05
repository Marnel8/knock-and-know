import * as z from "zod";

export const signUpSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
		firstName: z.string().min(1),
		lastName: z.string().min(1),
		avatar: z.string().min(1),
		role: z.enum(["teacher", "student"]),
		school: z.string().min(1),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export const updateProfileSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	avatar: z.string().min(1),
	school: z.string().min(1),
	role: z.enum(["teacher", "student"]),
	email: z.string().email(),
});
