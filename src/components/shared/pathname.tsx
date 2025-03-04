"use client";
import React from "react";
import { usePathname } from "next/navigation";
const PathName = () => {
	const pathname = usePathname();

	const path = pathname.replace("-", " ").split("/").pop();

	const pathName = path === "teacher" ? "Dashboard" : path;

	return (
		<h2 className="text-base font-semibold tracking-wide text-green-700 md:text-xl capitalize text-center">
			{pathName}
		</h2>
	);
};

export default PathName;
