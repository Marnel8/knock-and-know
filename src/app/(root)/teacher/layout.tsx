import TeacherNav from "@/components/shared/teacher/teacher-nav";
import React from "react";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="relative p-5 flex flex-col ">
			<TeacherNav />
			<div className="flex-1 flex justify-center items-center">{children}</div>
		</div>
	);
};

export default TeacherLayout;
