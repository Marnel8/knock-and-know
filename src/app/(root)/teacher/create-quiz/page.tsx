import BackButton from "@/components/shared/back-btn";
import React from "react";

const CreateQuizPage = () => {
	return (
		<div className="relative mt-20 md:mt-28 w-full rounded-4xl flex flex-col items-center justify-center min-h-screen bg-white max-w-[1190px]">
			<div className="absolute top-5 right-0 w-full h-full">
				<BackButton />
			</div>
		</div>
	);
};

export default CreateQuizPage;
