"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { avatars } from "@/constants/avatars";
import { signUpSchema } from "@/zod/auth";

import { auth, db } from "@/firebase/config";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SignUpForm = () => {
	const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			avatar: "",
			role: "teacher",
			school: "",
		},
	});

	const handleAvatarSelect = (index: number) => {
		setSelectedAvatar(index);
		setValue("avatar", avatars[index].src);
	};

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		try {
			if (!selectedAvatar) {
				setError("avatar", {
					type: "manual",
					message: "Please select an avatar",
				});
				return;
			}

			// Create user in Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			// Send verification email
			await sendEmailVerification(userCredential.user);

			// Save user data to Firestore
			await setDoc(doc(db, "users", userCredential.user.uid), {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				avatar: avatars[selectedAvatar].src,
				role: data.role,
				school: data.school,
				username: data.email.split("@")[0],
				institution: data.school,
				password: "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
			toast.success("Registration successful! Please verify your email.");
			router.push("/sign-in/teacher");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "An error occurred during registration";
			setError("root", {
				type: "manual",
				message: errorMessage,
			});
		}
	};

	return (
		<div className="mt-5">
			<form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
				{errors.root && (
					<p className="text-red-500 text-sm text-center mb-2">
						{errors.root.message}
					</p>
				)}

				{/* Name Fields */}
				<div className="flex flex-col md:flex-row gap-2">
					<div className="flex flex-col gap-2 flex-1">
						<Input
							type="text"
							placeholder="Name"
							className="text-input"
							{...register("firstName")}
						/>
						{errors.firstName && (
							<p className="text-red-500 text-sm text-center">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-2 flex-1">
						<Input
							type="text"
							placeholder="Surname"
							className="text-input"
							{...register("lastName")}
						/>
						{errors.lastName && (
							<p className="text-red-500 text-sm text-center">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>

				{/* Institution Field */}
				<Input
					type="text"
					placeholder="Institution"
					className="text-input"
					{...register("school")}
				/>
				{errors.school && (
					<p className="text-red-500 text-sm text-center">
						{errors.school.message}
					</p>
				)}

				{/* Email Field */}
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
				<Input
					type="password"
					placeholder="Confirm Password"
					className="text-input"
					{...register("confirmPassword")}
				/>
				{errors.confirmPassword && (
					<p className="text-red-500 text-sm text-center">
						{errors.confirmPassword.message}
					</p>
				)}

				<Dialog>
					<DialogTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="w-full h-10 py-8 border-4 border-green-700 cursor-pointer group hover:border-white hover:bg-green-700 hover:text-white transition-all duration-300 rounded-full group"
						>
							<div className="flex items-center gap-3">
								{selectedAvatar !== null ? (
									<div className="w-12 h-12 rounded-full bg-white border-4 border-gray-200 overflow-hidden">
										<Image
											src={avatars[selectedAvatar].src}
											alt={avatars[selectedAvatar].label}
											width={48}
											height={48}
											className="object-cover"
										/>
									</div>
								) : (
									<div className="w-12 h-12 rounded-full bg-green-700/10 group-hover:bg-green-700 border-2 group-hover:border-white overflow-hidden">
										<Image
											src="/avatars/man.png"
											alt="Default Avatar"
											width={48}
											height={48}
											className="object-cover"
										/>
									</div>
								)}
								<span className="text-green-700 font-genty group-hover:text-white">
									{selectedAvatar !== null
										? avatars[selectedAvatar].label
										: "Select Avatar"}
								</span>
							</div>
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-white/95 backdrop-blur-sm border-green-700/30">
						<DialogHeader>
							<DialogTitle className="text-green-700 font-genty">
								Choose Your Avatar
							</DialogTitle>
						</DialogHeader>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
							{avatars.map((avatar, index) => (
								<Button
									key={index}
									variant="ghost"
									className={`h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-700/10 transition-colors duration-200 ${
										selectedAvatar === index ? "bg-green-700/20" : ""
									}`}
									onClick={() => handleAvatarSelect(index)}
								>
									<div className="w-12 h-12 rounded-full bg-green-700/10 overflow-hidden">
										<Image
											src={avatar.src}
											alt={avatar.label}
											width={48}
											height={48}
											className="object-cover"
										/>
									</div>
									<span className="text-sm text-green-700 font-genty">
										{avatar.label}
									</span>
								</Button>
							))}
						</div>
					</DialogContent>
				</Dialog>
				{errors.avatar && (
					<p className="text-red-500 text-sm text-center">
						{errors.avatar.message}
					</p>
				)}

				{/* Submit Button */}
				<Button
					type="submit"
					disabled={isSubmitting}
					className="btn-primary text-xl tracking-wider px-10 py-6 md:px-16 md:py-10 mt-5 mx-auto"
				>
					{isSubmitting ? "Registering..." : "Register"}
				</Button>
			</form>

			{/* Login Link */}
			<div className="flex flex-col gap-2 mt-8 text-center text-white">
				<p className="text-center">Already have an account?</p>
				<Link
					href="/sign-in/teacher"
					className="underline hover:text-green-700 text-lg"
				>
					Login
				</Link>
			</div>
		</div>
	);
};

export default SignUpForm;
