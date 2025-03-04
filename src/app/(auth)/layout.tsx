import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex items-center justify-center h-screen font-genty tracking-wider">
			{children}
		</div>
	);
};

export default RootLayout;
