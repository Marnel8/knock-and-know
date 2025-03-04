import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const UserTypePage = () => {
	return (
		<div>
			<p className="text-3xl md:text-5xl text-white tracking-wider">
				Which one are you?
			</p>
			<div className="flex flex-col md:flex-row gap-6 mt-6 justify-center items-center">
				<Button
					className="btn-primary text-2xl tracking-wider px-10 py-6 md:px-16 md:py-10"
					asChild
				>
					<Link href="/sign-in/student">Student</Link>
				</Button>
				<Button
					className="btn-primary text-2xl tracking-wider px-10 py-6 md:px-16 md:py-10"
					asChild
				>
					<Link href="/sign-in/teacher">Teacher</Link>
				</Button>
			</div>
		</div>
	);
};

export default UserTypePage;
