import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TeacherDashboardPage = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-7">
			<div className="flex flex-col items-center justify-center gap-2">
				<h2 className="text-2xl md:text-4xl font-semibold text-white">
					Good day, <span className="text-[#ffd976]">Teacher!</span>
				</h2>
				<p className="text-sm md:text-lg text-white">
					Create quizzes, manage your library, and more.
				</p>
			</div>
			<div className="flex flex-col md:flex-row items-center justify-center gap-5">
				<div className="flex flex-col items-center justify-center gap-2 group cursor-pointer">
					<Button
						className="h-42 w-42 bg-white rounded-xl border-4 border-green-700 group-hover:bg-[#ffd976] hover:bg-[#ffd976] transition-all duration-300 ease-in-out cursor-pointer"
						asChild
					>
						<Link href="/teacher/create-quiz">
							<Image
								src="/1.svg"
								alt="create-quiz"
								width={150}
								height={150}
								className="group-hover:scale-110 transition-all duration-300 ease-in-out group-hover:rotate-12"
							/>
						</Link>
					</Button>
					<p className="text-center text-xl text-[#ffd976] ">Create Quiz</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-2 group cursor-pointer">
					<Button
						className="h-42 w-42 bg-white rounded-xl border-4 border-green-700 group-hover:bg-[#ffd976] hover:bg-[#ffd976] transition-all duration-300 ease-in-out cursor-pointer"
						asChild
					>
						<Link href="/teacher/my-library">
							<Image
								src="/2.svg"
								alt="create-quiz"
								width={150}
								height={150}
								className="group-hover:scale-110 transition-all duration-300 ease-in-out group-hover:rotate-12"
							/>
						</Link>
					</Button>
					<p className="text-center text-xl text-[#ffd976] ">My Library</p>
				</div>
			</div>
		</div>
	);
};

export default TeacherDashboardPage;
