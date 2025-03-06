"use client";

import { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDocs,
	orderBy,
	deleteDoc,
	doc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileQuestion, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Quiz {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	status: "draft" | "published";
	teacherId: string;
}

const truncateText = (text: string, limit: number) => {
	if (text.length <= limit) return text;
	return text.slice(0, limit) + "...";
};

const MyQuizzes = () => {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
	const user = useAuth();

	useEffect(() => {
		const fetchQuizzes = async () => {
			if (!user) return;

			try {
				setError(null);
				const quizQuery = query(
					collection(db, "quizes"),
					where("teacherId", "==", user.uid),
					orderBy("createdAt", "desc")
				);

				const querySnapshot = await getDocs(quizQuery);
				const fetchedQuizzes = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
					createdAt: doc.data().createdAt.toDate(),
				})) as Quiz[];

				setQuizzes(fetchedQuizzes);
			} catch (error: unknown) {
				console.error("Error fetching quizzes:", error);
				if (
					error instanceof Error &&
					error.message.includes("requires an index")
				) {
					setError("indexRequired");
				} else {
					setError(
						"An error occurred while fetching your quizzes. Please try again later."
					);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchQuizzes();
	}, [user]);

	const handleDelete = async (quiz: Quiz) => {
		try {
			await deleteDoc(doc(db, "quizes", quiz.id));
			setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q.id !== quiz.id));
			toast.success("Quiz deleted successfully");
		} catch (error) {
			console.error("Error deleting quiz:", error);
			toast.error("Failed to delete quiz");
		} finally {
			setQuizToDelete(null);
		}
	};

	const handleDeleteClick = (e: React.MouseEvent, quiz: Quiz) => {
		e.preventDefault(); // Prevent navigation when clicking delete
		setQuizToDelete(quiz);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<Loader2 className="w-8 h-8 animate-spin text-green-700" />
			</div>
		);
	}

	if (error === "indexRequired") {
		return (
			<Alert variant="destructive" className="mb-8">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Database Setup Required</AlertTitle>
				<AlertDescription className="mt-2">
					<p>One-time database setup is required to view your quizzes.</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => {
							window.open(
								"https://console.firebase.google.com/v1/r/project/fir-app-9eae7/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9maXItYXBwLTllYWU3L2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9xdWl6ZXMvaW5kZXhlcy9fEAEaDQoJdGVhY2hlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg",
								"_blank"
							);
						}}
					>
						Create Index
					</Button>
					<p className="text-sm mt-2">
						After creating the index, please wait a few minutes and refresh this
						page.
					</p>
				</AlertDescription>
			</Alert>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (quizzes.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">No quizzes created yet.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{quizzes.map((quiz) => (
					<Link
						href={`/teacher/my-library/${quiz.id}`}
						key={quiz.id}
						className="block group"
					>
						<Card className="hover:shadow-md transition-all duration-300 relative h-full bg-white border border-gray-100 rounded-3xl p-2">
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-4 right-4 h-8 w-8 text-gray-400 hover:text-[#D92D20] hover:bg-[#FEE4E2] z-10"
								onClick={(e) => handleDeleteClick(e, quiz)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
							<CardHeader className="p-4">
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-3">
										<div className="bg-[#F9F5FF] p-2 rounded-xl">
											<FileQuestion className="h-5 w-5 text-[#7F56D9]" />
										</div>
										<CardTitle className="text-lg font-semibold text-[#101828] group-hover:text-[#7F56D9] transition-colors">
											{quiz.name}
										</CardTitle>
									</div>
									{quiz.description && (
										<p
											className="text-[#475467] text-sm"
											title={quiz.description}
										>
											{truncateText(quiz.description, 50)}
										</p>
									)}
								</div>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<div className="flex items-center justify-between">
									<div className="text-sm text-[#475467]">
										Created {formatDistanceToNow(quiz.createdAt)} ago
									</div>
									<Badge
										variant={
											quiz.status === "published" ? "default" : "secondary"
										}
										className={`capitalize font-normal ${
											quiz.status === "draft"
												? "bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]"
												: "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]"
										}`}
									>
										{quiz.status}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			<Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Quiz</DialogTitle>
						<DialogDescription className="text-[#475467]">
							Are you sure you want to delete &quot;{quizToDelete?.name}&quot;?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setQuizToDelete(null)}
							className="border-[#D0D5DD] text-[#344054]"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => quizToDelete && handleDelete(quizToDelete)}
							className="bg-[#D92D20] hover:bg-[#B42318]"
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default MyQuizzes;
