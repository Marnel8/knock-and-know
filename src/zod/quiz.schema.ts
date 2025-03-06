import { z } from "zod";

export const questionSchema = z.object({
	type: z.enum(["multipleChoice", "trueFalse"]),
	question: z.string().min(1, "Question is required"),
	options: z.array(z.string()).optional(),
	correctAnswer: z.union([z.string(), z.boolean()]),
	timeLimit: z.number().default(30),
	phase: z.number().default(1),
});

export const examPhaseSchema = z.object({
	type: z.enum(["multipleChoice", "trueFalse"]),
	instructions: z.string().optional(),
	timeLimit: z.number().default(30),
});

export const roomSchema = z.object({
	name: z.string().min(1, "Room name is required"),
	capacity: z.number().min(1, "Capacity must be at least 1"),
	timeLimit: z
		.number()
		.min(1, "Time limit must be at least 1 minute")
		.default(60), // in minutes
	passcode: z.string().min(1, "Passcode is required"),
	status: z.enum(["pending", "inProgress", "completed"]).default("pending"),
	startedAt: z.date().nullable().default(null),
});

export const quizFormSchema = z.object({
	name: z.string().min(1, "Quiz name is required"),
	description: z.string().optional(),
	examPhases: z.array(examPhaseSchema).min(1, "At least one phase is required"),
	questions: z
		.array(questionSchema)
		.min(1, "At least one question is required"),
	startDateTime: z.date(),
	endDateTime: z.date(),
	rooms: z.array(roomSchema),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionType = z.infer<typeof questionSchema>;
export type RoomType = z.infer<typeof roomSchema>;
export type ExamPhaseType = z.infer<typeof examPhaseSchema>;
