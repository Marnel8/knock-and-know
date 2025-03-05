"use client";
import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useRouter } from "next/navigation";
const LogoutBtn = () => {
	const router = useRouter();

	const handleLogout = async () => {
		await signOut(auth);
		router.push("/sign-in/teacher");
	};
	return (
		<Button
			onClick={handleLogout}
			variant="ghost"
			size="icon"
			className="cursor-pointer hover:bg-green-700/10 rounded-full transition-colors duration-200 hover:text-red-700"
		>
			<LogOut className="w-6 h-6 text-gray-700" />
		</Button>
	);
};

export default LogoutBtn;
