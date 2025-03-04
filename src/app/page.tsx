import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MotionDiv from "@/components/shared/motion-div";

const Landing = () => {
	return (
		<div className="min-h-screen flex items-center justify-center font-genty">
			<div className="relative">
				<MotionDiv
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{
						duration: 0.4,
						delay: 0.5,
					}}
				>
					<Image
						src={"/knk.svg"}
						priority
						alt="KNK Logo"
						width={900}
						height={900}
					/>
				</MotionDiv>
				<MotionDiv
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					transition={{
						duration: 0.6,
						delay: 1,
					}}
				>
					<Button
						className="absolute transition-all duration-500 ease-in-out left-1/2 -bottom-8 md:bottom-0 -translate-x-1/2 -translate-y-1/2 tracking-wider px-8 py-6 md:px-14 md:py-7 text-2xl -rotate-4 hover:rotate-0 md:text-4xl rounded-full bg-white text-black ring-4 ring-green-700 shadow-xl hover:bg-green-700 hover:text-white cursor-pointer hover:ring-white"
						asChild
					>
						<Link href="/user-type">START</Link>
					</Button>
				</MotionDiv>
			</div>
		</div>
	);
};

export default Landing;
