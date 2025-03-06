"use client";
import React from "react";

import QuizDetails from "@/components/teacher/quiz/QuizDetails";

const QuizDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
	const resolvedParams = React.use(params);
	return <QuizDetails quizId={resolvedParams.id} />;
};

export default QuizDetailsPage;
