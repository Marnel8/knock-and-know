import React from "react";
import BackButton from "@/components/shared/back-btn";
import MyQuizzes from "@/components/teacher/MyQuizzes";

const MyLibraryPage = () => {
	return (
		<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col py-10 min-h-screen bg-white max-w-[1190px] relative">
			<div className="mb-5">
				<BackButton />
			</div>
			<div className="w-full max-w-6xl px-10 pb-8">
				<h1 className="text-2xl font-bold mb-8">My Quiz Library</h1>
				<MyQuizzes />
			</div>
		</div>
	);
};

export default MyLibraryPage;
