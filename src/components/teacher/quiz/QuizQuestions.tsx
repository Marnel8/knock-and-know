interface Question {
	type: "multipleChoice" | "trueFalse";
	question: string;
	options?: string[];
	correctAnswer: string | boolean;
	timeLimit: number;
	phase: number;
}

interface QuizQuestionsProps {
	questions: Question[];
}

const QuizQuestions = ({ questions }: QuizQuestionsProps) => {
	return (
		<div className="space-y-6">
			{questions.map((question, index) => (
				<div key={index} className="bg-white rounded-lg shadow p-6">
					<div className="flex items-start gap-4">
						<div className="bg-maroon-100 text-maroon-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
							{index + 1}
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-medium mb-2">{question.question}</h3>
							<div className="space-y-2">
								{question.type === "multipleChoice" &&
									question.options?.map((option, optIndex) => (
										<div
											key={optIndex}
											className={`flex items-center justify-between p-3 rounded-lg border ${
												option === question.correctAnswer
													? "border-green-500 bg-green-50"
													: "border-gray-200"
											}`}
										>
											<span>{option}</span>
											{option === question.correctAnswer && (
												<span className="text-green-600">Correct Answer</span>
											)}
										</div>
									))}
								{question.type === "trueFalse" && (
									<>
										<div
											className={`flex items-center justify-between p-3 rounded-lg border ${
												question.correctAnswer === true
													? "border-green-500 bg-green-50"
													: "border-gray-200"
											}`}
										>
											<span>True</span>
											{question.correctAnswer === true && (
												<span className="text-green-600">Correct Answer</span>
											)}
										</div>
										<div
											className={`flex items-center justify-between p-3 rounded-lg border ${
												question.correctAnswer === false
													? "border-green-500 bg-green-50"
													: "border-gray-200"
											}`}
										>
											<span>False</span>
											{question.correctAnswer === false && (
												<span className="text-green-600">Correct Answer</span>
											)}
										</div>
									</>
								)}
								<div className="mt-4 text-sm text-gray-500">
									Time Limit: {question.timeLimit} seconds
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
			{questions.length === 0 && (
				<div className="text-center text-gray-500">No questions available.</div>
			)}
		</div>
	);
};

export default QuizQuestions;
