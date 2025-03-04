"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const BackButton = () => {
	const router = useRouter();

	return (
		<div className="w-full px-6">
			<Button
				variant="ghost"
				className="flex items-center gap-2 text-gray-700 hover:text-green-700 hover:bg-green-700/10 transition-colors duration-200"
				onClick={() => router.back()}
			>
				<ArrowLeft className="w-5 h-5" />
				<span className="font-genty">Go Back</span>
			</Button>
		</div>
	);
};

export default BackButton;
