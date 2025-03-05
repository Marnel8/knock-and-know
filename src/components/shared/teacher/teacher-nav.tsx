import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import PathName from "../pathname";
import LogoutBtn from "../logout-btn";
import UserInfo from "../user-info";

const TeacherNav = () => {
	return (
		<div className="w-[90%] md:w-[95%] bg-white md:max-w-[1190px] mx-auto rounded-full py-2 md:py-5 px-5 md:px-10 shadow-sm fixed top-5 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center justify-between">
				<UserInfo />
				<div className="hidden md:block flex-1 ">
					<PathName />
				</div>
				<div>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer hover:bg-green-700/10 rounded-full transition-colors duration-200"
					>
						<Settings className="w-6 h-6 text-gray-700" />
					</Button>
					<LogoutBtn />
				</div>
			</div>
		</div>
	);
};

export default TeacherNav;
