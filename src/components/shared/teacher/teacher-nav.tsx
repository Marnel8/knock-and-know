import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import PathName from "../pathname";

const TeacherNav = () => {
	return (
		<div className="w-[90%] md:w-[95%] bg-white md:max-w-[1190px] mx-auto rounded-full py-2 md:py-5 px-5 md:px-10 shadow-sm fixed top-5 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center justify-between">
				<Link href="/teacher">
					<div className="flex items-center gap-2">
						<Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-green-700/20">
							<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className="">
							<p className=" font-semibold tracking-wide text-gray-800 text-sm md:text-lg">
								John Doe
							</p>
							<p className="text-xs text-gray-500 md:text-sm">Teacher</p>
						</div>
					</div>
				</Link>
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
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer hover:bg-green-700/10 rounded-full transition-colors duration-200 hover:text-red-700"
					>
						<LogOut className="w-6 h-6 text-gray-700" />
					</Button>
				</div>
			</div>
		</div>
	);
};

export default TeacherNav;
