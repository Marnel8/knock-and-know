import React from "react";
import { Loader2 } from "lucide-react";

const loading = () => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col items-center gap-4">
				<Loader2 className="w-12 h-12 animate-spin text-green-700" />
				<p className="text-lg font-medium text-gray-600">Loading...</p>
			</div>
		</div>
	);
};

export default loading;
