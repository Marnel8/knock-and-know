import React from "react";
import BackButton from "@/components/shared/back-btn";

const MyLibraryPage = () => {
	return (
		<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col items-center justify-center min-h-screen bg-white max-w-[1190px] relative">
			<div className="absolute top-5 right-0 w-full h-full">
				<BackButton />
			</div>
		</div>
	);
};

export default MyLibraryPage;
