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
import { AlertCircle, FileQuestion, Loader2, Trash2, Edit } from "lucide-react";
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
import { useRouter } from "next/navigation";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface Quiz {
	id: string;
	name: string;
	description?: string;
	createdAt: Date;
	status: "draft" | "published";
	teacherId: string;
}

const getCardColors = (index: number) => {
	const colors = [
		{
			border: "border-l-emerald-400",
			bg: "bg-emerald-50",
			text: "text-emerald-500",
		},
		{
			border: "border-l-sky-400",
			bg: "bg-sky-50",
			text: "text-sky-500",
		},
		{
			border: "border-l-violet-400",
			bg: "bg-violet-50",
			text: "text-violet-500",
		},
		{
			border: "border-l-amber-400",
			bg: "bg-amber-50",
			text: "text-amber-500",
		},
		{
			border: "border-l-rose-400",
			bg: "bg-rose-50",
			text: "text-rose-500",
		},
	];
	return colors[index % colors.length];
};

const MyQuizzes = () => {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
	const user = useAuth();
	const router = useRouter();

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

	const handleEditClick = (e: React.MouseEvent, quizId: string) => {
		e.preventDefault(); // Prevent navigation from parent Link
		e.stopPropagation(); // Prevent event bubbling
		router.push(`/teacher/my-library/edit/${quizId}`);
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{quizzes.map((quiz, index) => {
				const colors = getCardColors(index);
				return (
					<Link
						key={quiz.id}
						href={`/teacher/my-library/${quiz.id}`}
						className="block"
					>
						<Card
							className={`h-full hover:shadow-lg transition-shadow duration-200 border-l-4 ${colors.border}`}
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<div className="flex items-center gap-3">
									<div className={`p-2 ${colors.bg} rounded-lg`}>
										<FileQuestion className={`w-5 h-5 ${colors.text}`} />
									</div>
									<CardTitle className="text-lg font-semibold">
										{quiz.name}
									</CardTitle>
								</div>
								<div className="flex items-center gap-2">
									{quiz.status === "draft" && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<button
														onClick={(e) => handleEditClick(e, quiz.id)}
														className={`text-gray-500 hover:${colors.text} transition-colors cursor-pointer duration-200 transform hover:scale-110 hover:text-blue-600`}
													>
														<Edit className="w-5 h-5" />
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Edit quiz</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													onClick={(e) => handleDeleteClick(e, quiz)}
													className="text-gray-500 hover:text-red-600 transition-colors cursor-pointer duration-200 transform hover:scale-110"
												>
													<Trash2 className="w-5 h-5" />
												</button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Delete quiz</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-gray-500 line-clamp-2 mb-4">
									{quiz.description || "No description"}
								</p>
								<div className="flex items-center justify-between">
									<Badge
										variant={
											quiz.status === "published" ? "default" : "secondary"
										}
										className={
											quiz.status === "published"
												? `${colors.bg} ${colors.text} border-0`
												: ""
										}
									>
										{quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
									</Badge>
									<span className="text-xs text-gray-500">
										Created{" "}
										{formatDistanceToNow(quiz.createdAt, {
											addSuffix: true,
										})}
									</span>
								</div>
							</CardContent>
						</Card>
					</Link>
				);
			})}
			{quizzes.length === 0 && !error && (
				<div className="col-span-full">
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>No quizzes found</AlertTitle>
						<AlertDescription>
							You haven&apos;t created any quizzes yet. Start by creating a new
							quiz!
						</AlertDescription>
					</Alert>
				</div>
			)}
			{error && (
				<div className="col-span-full">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>
							{error === "indexRequired" ? (
								<>
									The quiz list requires an index to be created. Please wait a
									few minutes and try again.
								</>
							) : (
								error
							)}
						</AlertDescription>
					</Alert>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Quiz</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &quot;{quizToDelete?.name}&quot;?
							This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setQuizToDelete(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => quizToDelete && handleDelete(quizToDelete)}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MyQuizzes;
