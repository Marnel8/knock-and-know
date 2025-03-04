"use client";
import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import Link from "next/link";

const SignInform = () => {
	return (
		<form className="flex flex-col gap-3 mt-6 justify-center items-center">
			<Input type="email" placeholder="Email" className="text-input" />
			<Input type="password" placeholder="Password" className="text-input" />

			<Button className="btn-primary text-xl tracking-wider px-10 py-6 md:px-16 md:py-10 mt-2">
				Login
			</Button>

			<div className="flex flex-col items-center justify-center  text-white mt-2">
				<p>Don't have an account?</p>
				<Link
					href="/sign-up/teacher"
					className="underline hover:text-green-500 text-lg "
				>
					Register
				</Link>
			</div>
		</form>
	);
};

export default SignInform;
