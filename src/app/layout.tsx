import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import BackgroundMusic from "@/components/shared/background-music";

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
				<BackgroundMusic />
				<div
					className={`${geistSans.variable} ${geistMono.variable} ${gentySans.variable} antialiased relative`}
				>
					<Toaster
						position="top-center"
						reverseOrder={false}
						gutter={8}
						containerClassName=""
						containerStyle={{}}
						toastOptions={{
							// Default options for specific types
							success: {
								duration: 3000,
								style: {
									background: "#10B981",
									color: "#fff",
									fontFamily: "var(--font-geist-sans)",
								},
							},
							error: {
								duration: 4000,
								style: {
									background: "#EF4444",
									color: "#fff",
									fontFamily: "var(--font-geist-sans)",
								},
							},
							// Default options for all toasts
							style: {
								background: "#18181B",
								color: "#fff",
								fontFamily: "var(--font-geist-sans)",
								borderRadius: "8px",
								padding: "16px",
								boxShadow:
									"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
							},
						}}
					/>
					<div className="fixed inset-0 bg-[url(/knk-bg.svg)] bg-center bg-cover -z-10" />
					<div className="relative min-h-screen">{children}</div>
				</div>
			</body>
		</html>
	);
}
