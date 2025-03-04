import SignUpForm from "@/components/auth/teacher/sign-up-form";
import React from "react";

const SignUpTeacherPage = () => {
	return (
		<div className="flex flex-col gap-5">
			<h2 className="text-3xl md:text-5xl text-white tracking-wider text-center">
				Sign up as Teacher
			</h2>
			<SignUpForm />
		</div>
	);
};

export default SignUpTeacherPage;
