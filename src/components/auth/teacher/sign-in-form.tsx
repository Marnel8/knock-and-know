"use client";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/zod/auth";
import * as z from "zod";
import { auth } from "@/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
const SignInform = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			if (!userCredential.user.emailVerified) {
				await auth.signOut();
				setError("root", {
					type: "manual",
					message:
						"Please verify your email before signing in. Check your inbox for the verification link.",
				});
				return;
			}
			toast.success("Login successful! Redirecting to dashboard...");
			router.push("/teacher");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Invalid email or password";
			setError("root", {
				type: "manual",
				message: errorMessage,
			});
		}
	};

	return (
		<form
			className="flex flex-col gap-3 mt-6 justify-center items-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			{errors.root && (
				<p className="text-red-500 text-sm text-center">
					{errors.root.message}
				</p>
			)}

			<div className="flex flex-col w-full gap-1">
				<Input
					type="email"
					placeholder="Email"
					className="text-input"
					{...register("email")}
				/>
				{errors.email && (
					<p className="text-red-500 text-sm text-center">
						{errors.email.message}
					</p>
				)}
			</div>

			<div className="flex flex-col w-full gap-1">
				<Input
					type="password"
					placeholder="Password"
					className="text-input"
					{...register("password")}
				/>
				{errors.password && (
					<p className="text-red-500 text-sm text-center">
						{errors.password.message}
					</p>
				)}
			</div>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="btn-primary text-xl tracking-wider px-10 py-6 md:px-16 md:py-10 mt-2"
			>
				{isSubmitting ? "Logging in..." : "Login"}
			</Button>

			<div className="flex flex-col items-center justify-center text-white mt-2">
				<p>Don&apos;t have an account?</p>
				<Link
					href="/sign-up/teacher"
					className="underline hover:text-green-500 text-lg"
				>
					Register
				</Link>
			</div>
		</form>
	);
};

export default SignInform;
