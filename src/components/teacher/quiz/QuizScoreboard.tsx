interface Participant {
	id: string;
	name: string;
	score: number;
	avatar: string;
	completedAt: Date;
}

interface RankedParticipant extends Participant {
	rank: number;
}

interface QuizScoreboardProps {
	participants: Participant[];
}

const QuizScoreboard = ({ participants }: QuizScoreboardProps) => {
	// Sort participants by score and assign ranks
	const rankedParticipants: RankedParticipant[] = participants
		.sort((a, b) => b.score - a.score)
		.map((participant, index, array) => {
			const rank =
				index === 0
					? 1
					: (array[index - 1] as RankedParticipant).score === participant.score
					? (array[index - 1] as RankedParticipant).rank
					: index + 1;
			return { ...participant, rank };
		});

	return (
		<div className="bg-white rounded-lg shadow">
			<div className="grid grid-cols-12 gap-4 p-4 border-b bg-maroon-600 text-white rounded-t-lg">
				<div className="col-span-1 font-semibold">Rank</div>
				<div className="col-span-9 font-semibold">Name</div>
				<div className="col-span-2 font-semibold text-right">Score</div>
			</div>
			{rankedParticipants.map((participant) => (
				<div
					key={participant.id}
					className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50"
				>
					<div className="col-span-1">{participant.rank}</div>
					<div className="col-span-9 flex items-center gap-2">
						<span className="text-xl">{participant.avatar}</span>
						{participant.name}
					</div>
					<div className="col-span-2 text-right font-medium">
						{participant.score}
					</div>
				</div>
			))}
			{participants.length === 0 && (
				<div className="p-4 text-center text-gray-500">
					No scores available yet.
				</div>
			)}
		</div>
	);
};

export default QuizScoreboard;
