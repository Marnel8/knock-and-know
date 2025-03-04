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

const SignUpForm = () => {
	const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

	const avatars = [
		{ src: "/avatars/man.png", label: "Man" },
		{ src: "/avatars/woman.png", label: "Woman" },
		{ src: "/avatars/boy.png", label: "Boy" },
		{ src: "/avatars/girl.png", label: "Girl" },
		{ src: "/avatars/gamer.png", label: "Gamer" },
		{ src: "/avatars/lion.png", label: "Lion" },
		{ src: "/avatars/panda.png", label: "Panda" },
		{ src: "/avatars/meerkat.png", label: "Meerkat" },
		{ src: "/avatars/chicken.png", label: "Chicken" },
	];

	return (
		<div className="mt-5">
			<form className="flex flex-col gap-2">
				<div className="flex flex-col md:flex-row gap-2">
					<Input type="text" placeholder="Name" className="text-input" />
					<Input type="text" placeholder="Surname" className="text-input" />
				</div>
				<Input type="text" placeholder="Institution" className="text-input" />
				<Input type="email" placeholder="Email" className="text-input" />
				<Input type="password" placeholder="Password" className="text-input" />
				<Input
					type="password"
					placeholder="Confirm Password"
					className="text-input"
				/>

				{/* Avatar Selection */}
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
									onClick={() => setSelectedAvatar(index)}
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

				<Button className="btn-primary text-xl tracking-wider px-10 py-6 md:px-16 md:py-10 mt-5 mx-auto">
					Register
				</Button>
			</form>
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
