import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";

interface Participant {
	id: string;
	name: string;
	score: number;
	avatar: string;
	completedAt: Date;
}

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
	participants: Participant[];
}

interface QuizOverviewProps {
	quizData: QuizData;
}

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

const QuizOverview = ({ quizData }: QuizOverviewProps) => {
	const totalParticipants = quizData.participants.length;
	const totalQuestions = quizData.questions.length;
	const maxPossibleScore = totalQuestions; // Assuming 1 point per question

	// Calculate statistics
	const averageScore =
		totalParticipants > 0
			? (
					quizData.participants.reduce((sum, p) => sum + p.score, 0) /
					totalParticipants
			  ).toFixed(1)
			: 0;

	const highestScore =
		totalParticipants > 0
			? Math.max(...quizData.participants.map((p) => p.score))
			: 0;

	const lowestScore =
		totalParticipants > 0
			? Math.min(...quizData.participants.map((p) => p.score))
			: 0;

	// Calculate performance distribution
	const getScorePercentage = (score: number) =>
		(score / maxPossibleScore) * 100;

	const distributions = {
		"90-100": quizData.participants.filter(
			(p) => getScorePercentage(p.score) >= 90
		).length,
		"80-89": quizData.participants.filter(
			(p) =>
				getScorePercentage(p.score) >= 80 && getScorePercentage(p.score) < 90
		).length,
		"70-79": quizData.participants.filter(
			(p) =>
				getScorePercentage(p.score) >= 70 && getScorePercentage(p.score) < 80
		).length,
		"60-69": quizData.participants.filter(
			(p) =>
				getScorePercentage(p.score) >= 60 && getScorePercentage(p.score) < 70
		).length,
		"Below 60": quizData.participants.filter(
			(p) => getScorePercentage(p.score) < 60
		).length,
	};

	// Prepare data for pie chart
	const pieData = Object.entries(distributions).map(([name, value]) => ({
		name,
		value,
	}));

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-4">Quiz Statistics</h2>
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-gray-600">Total Participants</span>
						<span className="font-medium">{totalParticipants}</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-600">Average Score</span>
						<span className="font-medium">
							{averageScore}/{maxPossibleScore}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-600">Highest Score</span>
						<span className="font-medium">
							{highestScore}/{maxPossibleScore}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span className="text-gray-600">Lowest Score</span>
						<span className="font-medium">
							{lowestScore}/{maxPossibleScore}
						</span>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<h2 className="text-xl font-semibold mb-4">Performance Distribution</h2>
				{totalParticipants > 0 ? (
					<div className="w-full h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) =>
										percent > 0
											? `${name} (${(percent * 100).toFixed(0)}%)`
											: ""
									}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{pieData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				) : (
					<p className="text-center text-gray-500">No data available</p>
				)}
			</div>
		</div>
	);
};

export default QuizOverview;
