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
				<div className="space-y-4">
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">90-100%</span>
							<span className="font-medium">
								{distributions["90-100"]} students
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-maroon-600 h-2 rounded-full"
								style={{
									width: `${
										(distributions["90-100"] / totalParticipants) * 100
									}%`,
								}}
							></div>
						</div>
					</div>
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">80-89%</span>
							<span className="font-medium">
								{distributions["80-89"]} students
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-maroon-600 h-2 rounded-full"
								style={{
									width: `${
										(distributions["80-89"] / totalParticipants) * 100
									}%`,
								}}
							></div>
						</div>
					</div>
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">70-79%</span>
							<span className="font-medium">
								{distributions["70-79"]} students
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-maroon-600 h-2 rounded-full"
								style={{
									width: `${
										(distributions["70-79"] / totalParticipants) * 100
									}%`,
								}}
							></div>
						</div>
					</div>
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">60-69%</span>
							<span className="font-medium">
								{distributions["60-69"]} students
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-maroon-600 h-2 rounded-full"
								style={{
									width: `${
										(distributions["60-69"] / totalParticipants) * 100
									}%`,
								}}
							></div>
						</div>
					</div>
					<div>
						<div className="flex justify-between items-center mb-2">
							<span className="text-gray-600">Below 60%</span>
							<span className="font-medium">
								{distributions["Below 60"]} students
							</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-maroon-600 h-2 rounded-full"
								style={{
									width: `${
										(distributions["Below 60"] / totalParticipants) * 100
									}%`,
								}}
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuizOverview;
