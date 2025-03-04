import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const gentySans = localFont({
	src: "./fonts/Genty-Sans-Regular.ttf",
	variable: "--font-genty",
});

export const metadata: Metadata = {
	title: "Knock and Know",
	description: "Knock and Know - A web app for quizes and learning.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<link rel="preload" as="image" href="/knk-bg.svg" />
			</head>
			<body>
				<div
					className={`${geistSans.variable} ${geistMono.variable} ${gentySans.variable} antialiased relative`}
				>
					<div className="fixed inset-0 bg-[url(/knk-bg.svg)] bg-center bg-cover -z-10" />
					<div className="relative min-h-screen">{children}</div>
				</div>
			</body>
		</html>
	);
}
