"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";
import useUserData from "@/hooks/useUserData";

const UserInfo = () => {
	const { userData, loading } = useUserData();

	if (loading) {
		return (
			<div className="flex items-center gap-2 animate-pulse">
				<div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200" />
				<div className="space-y-2">
					<div className="h-4 w-24 bg-gray-200 rounded" />
					<div className="h-3 w-16 bg-gray-200 rounded" />
				</div>
			</div>
		);
	}

	if (!userData) {
		return null;
	}

	const initials =
		`${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();

	return (
		<div>
			<Link href={`/${userData.role.toLowerCase()}`}>
				<div className="flex items-center gap-2">
					<Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-green-700/20">
						<AvatarImage
							src={userData.avatar}
							alt={`${userData.firstName} ${userData.lastName}`}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="">
						<p className="font-semibold tracking-wide text-gray-800 text-sm md:text-lg">
							{userData.firstName} {userData.lastName}
						</p>
						<p className="text-xs text-gray-500 md:text-sm capitalize">
							{userData.role}
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default UserInfo;
