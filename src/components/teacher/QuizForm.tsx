"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface QuizFormData {
	name: string;
	description: string;
	status: "draft" | "published";
}

interface QuizFormProps {
	initialData?: QuizFormData;
	onSubmit: (data: QuizFormData) => Promise<void>;
	submitLabel: string;
}

export default function QuizForm({
	initialData,
	onSubmit,
	submitLabel,
}: QuizFormProps) {
	const [formData, setFormData] = useState<QuizFormData>({
		name: initialData?.name || "",
		description: initialData?.description || "",
		status: initialData?.status || "draft",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await onSubmit(formData);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name">Quiz Name</Label>
				<Input
					id="name"
					required
					value={formData.name}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, name: e.target.value }))
					}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description (Optional)</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) =>
						setFormData((prev) => ({ ...prev, description: e.target.value }))
					}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="status">Status</Label>
				<Select
					value={formData.status}
					onValueChange={(value: "draft" | "published") =>
						setFormData((prev) => ({ ...prev, status: value }))
					}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="draft">Draft</SelectItem>
						<SelectItem value="published">Published</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Button type="submit" disabled={loading} className="w-full">
				{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{submitLabel}
			</Button>
		</form>
	);
}
