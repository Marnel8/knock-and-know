"use client";
import React, { use } from "react";
import BackButton from "@/components/shared/back-btn";
import { QuizForm } from "@/components/forms/quiz-form";
import { QuizFormValues } from "@/zod/quiz.schema";
import { db } from "@/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface EditQuizPageProps {
	params: Promise<{
		quizId: string;
	}>;
}

const EditQuizPage = ({ params }: EditQuizPageProps) => {
	const { quizId } = use(params);
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [quizData, setQuizData] = useState<QuizFormValues | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const quizDoc = await getDoc(doc(db, "quizes", quizId));
				if (!quizDoc.exists()) {
					setError("Quiz not found");
					return;
				}

				const data = quizDoc.data();
				// Convert Firestore timestamps to Date objects
				const formattedData = {
					...data,
					startDateTime: data.startDateTime?.toDate(),
					endDateTime: data.endDateTime?.toDate(),
				} as QuizFormValues;

				setQuizData(formattedData);
			} catch (err) {
				console.error("Error fetching quiz:", err);
				setError("Failed to load quiz data");
			} finally {
				setLoading(false);
			}
		};

		fetchQuizData();
	}, [quizId]);

	const handleSubmit = async (data: QuizFormValues) => {
		try {
			const updateData = {
				...data,
				updatedAt: new Date(),
			};

			await updateDoc(doc(db, "quizes", quizId), updateData);
			toast.success("Quiz updated successfully!");
			router.push("/teacher/my-library");
		} catch (error) {
			console.error("Error updating quiz:", error);
			toast.error("Failed to update quiz. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col items-center justify-center py-10 min-h-screen bg-white max-w-[1190px]">
				<Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
				<p className="mt-2 text-gray-600">Loading quiz data...</p>
			</div>
		);
	}

	if (error || !quizData) {
		return (
			<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col items-center justify-center py-10 min-h-screen bg-white max-w-[1190px]">
				<p className="text-red-600">{error || "Failed to load quiz"}</p>
			</div>
		);
	}

	return (
		<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col py-10 min-h-screen bg-white max-w-[1190px] relative">
			<div className="mb-5">
				<BackButton />
			</div>
			<div className="w-full max-w-6xl px-10 pb-8">
				<h1 className="text-2xl font-bold mb-8">Edit Quiz</h1>
				<QuizForm onSubmit={handleSubmit} initialData={quizData} />
			</div>
		</div>
	);
};

export default EditQuizPage;
