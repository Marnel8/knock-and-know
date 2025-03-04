import React from "react";
import SignInform from "@/components/auth/teacher/sign-in-form";

const SignInAsTeacherPage = () => {
	return (
		<div>
			<h2 className="text-3xl md:text-5xl text-white tracking-wider text-center">
				Login as Teacher
			</h2>
			<SignInform />
		</div>
	);
};

export default SignInAsTeacherPage;
