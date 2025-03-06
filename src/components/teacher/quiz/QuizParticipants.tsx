interface Participant {
	id: string;
	name: string;
	score: number;
	avatar: string;
	completedAt: Date;
}

interface QuizParticipantsProps {
	participants: Participant[];
}

const QuizParticipants = ({ participants }: QuizParticipantsProps) => {
	return (
		<div className="bg-white rounded-lg shadow p-6">
			<h2 className="text-xl font-semibold mb-4">Participants</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{participants.map((participant) => (
					<div
						key={participant.id}
						className="flex items-center space-x-3 p-3 border rounded-lg"
					>
						<div className="w-10 h-10 bg-maroon-100 rounded-full flex items-center justify-center">
							<span className="text-xl">{participant.avatar}</span>
						</div>
						<div>
							<p className="font-medium">{participant.name}</p>
							<p className="text-sm text-gray-500">
								Score: {participant.score}
							</p>
						</div>
					</div>
				))}
			</div>
			{participants.length === 0 && (
				<p className="text-center text-gray-500 mt-4">No participants yet.</p>
			)}
		</div>
	);
};

export default QuizParticipants;
