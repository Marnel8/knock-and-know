"use client";

import BackButton from "@/components/shared/back-btn";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizScoreboard from "./QuizScoreboard";
import QuizParticipants from "./QuizParticipants";
import QuizQuestions from "./QuizQuestions";
import QuizOverview from "./QuizOverview";
import { db } from "@/firebase/config";
import {
	doc,
	getDoc,
	collection,
	getDocs,
	query,
	where,
	orderBy,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";

interface Question {
	type: "multipleChoice" | "trueFalse";
	question: string;
	options?: string[];
	correctAnswer: string | boolean;
	timeLimit: number;
	phase: number;
}

interface QuizData {
	id: string;
	name: string;
	description?: string;
	status: "draft" | "published" | "completed";
	questions: Question[];
	participants: {
		id: string;
		name: string;
		score: number;
		avatar: string;
		completedAt: Date;
	}[];
}

interface QuizDetailsProps {
	quizId: string;
}

const QuizDetails = ({ quizId }: QuizDetailsProps) => {
	const [quizData, setQuizData] = useState<QuizData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				// Fetch quiz details
				const quizDoc = await getDoc(doc(db, "quizes", quizId));
				if (!quizDoc.exists()) {
					setError("Quiz not found");
					return;
				}

				// Fetch quiz participants and their scores
				const participantsQuery = query(
					collection(db, "quiz_participants"),
					where("quizId", "==", quizId),
					orderBy("score", "desc")
				);
				const participantsSnapshot = await getDocs(participantsQuery);
				const participants = participantsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
					completedAt: doc.data().completedAt?.toDate(),
				}));

				setQuizData({
					id: quizDoc.id,
					...quizDoc.data(),
					participants,
				} as QuizData);
			} catch (err) {
				console.error("Error fetching quiz data:", err);
				setError("Failed to load quiz data");
			} finally {
				setLoading(false);
			}
		};

		fetchQuizData();
	}, [quizId]);

	if (loading) {
		return (
			<div className="mt-20 md:mt-28 w-full rounded-4xl flex flex-col items-center justify-center py-10 min-h-screen bg-white max-w-[1190px]">
				<Loader2 className="w-8 h-8 animate-spin text-maroon-600" />
				<p className="mt-2 text-gray-600">Loading quiz details...</p>
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
				{/* Quiz Header */}
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl font-bold">{quizData.name}</h1>
					<span
						className={`px-4 py-1 rounded-full text-sm ${
							quizData.status === "completed"
								? "bg-maroon-600 text-white"
								: quizData.status === "published"
								? "bg-green-600 text-white"
								: "bg-gray-600 text-white"
						}`}
					>
						{quizData.status.charAt(0).toUpperCase() + quizData.status.slice(1)}
					</span>
				</div>

				{/* Tabs */}
				<Tabs defaultValue="scoreboard" className="w-full">
					<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-8">
						<TabsTrigger value="participants">Participants</TabsTrigger>
						<TabsTrigger value="questions">Questions</TabsTrigger>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="scoreboard">Scoreboard</TabsTrigger>
					</TabsList>

					<TabsContent value="participants">
						<QuizParticipants participants={quizData.participants} />
					</TabsContent>

					<TabsContent value="questions">
						<QuizQuestions questions={quizData.questions} />
					</TabsContent>

					<TabsContent value="overview">
						<QuizOverview quizData={quizData} />
					</TabsContent>

					<TabsContent value="scoreboard">
						<QuizScoreboard participants={quizData.participants} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default QuizDetails;
