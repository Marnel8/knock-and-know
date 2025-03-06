"use client";

import BackButton from "@/components/shared/back-btn";
import { QuizForm } from "@/components/forms/quiz-form";
import { QuizFormValues } from "@/zod/quiz.schema";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";

const CreateQuizPage = () => {
	const router = useRouter();
	const user = useAuth();

	const handleSubmit = async (data: QuizFormValues) => {
		try {
			if (!user) {
				toast.error("You must be logged in to create a quiz");
				return;
			}

			const quizData = {
				...data,
				teacherId: user.uid,
				createdAt: new Date(),
				updatedAt: new Date(),
				status: "draft",
			};

			await addDoc(collection(db, "quizes"), quizData);

			toast.success("Quiz created successfully!");
			router.push(`/teacher/my-library`);
		} catch (error) {
			console.error("Error creating quiz:", error);
			toast.error("Failed to create quiz. Please try again.");
		}
	};

	return (
		<div className="relative mt-20 py-5 md:mt-28 w-full rounded-4xl flex flex-col items-start justify-center min-h-screen bg-white max-w-[1190px]">
			<div className="mb-5">
				<BackButton />
			</div>
			<div className="w-full max-w-6xl px-10 pb-8">
				<h1 className="text-2xl font-bold mb-8">Create New Quiz</h1>
				<QuizForm onSubmit={handleSubmit} />
			</div>
		</div>
	);
};

export default CreateQuizPage;
