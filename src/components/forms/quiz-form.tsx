"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuizFormValues, quizFormSchema } from "@/zod/quiz.schema";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface QuizFormProps {
	onSubmit: (data: QuizFormValues) => void;
	initialData?: QuizFormValues;
}

const DEFAULT_OPTIONS = ["", "", "", ""];
const ALPHABET = ["A", "B", "C", "D"];

export function QuizForm({ onSubmit, initialData }: QuizFormProps) {
	const [currentStep, setCurrentStep] = useState<"quiz" | "rooms">("quiz");
	const [showOptions, setShowOptions] = useState<boolean[]>([]);

	const form = useForm<QuizFormValues>({
		resolver: zodResolver(quizFormSchema),
		defaultValues: initialData || {
			name: "",
			description: "",
			examPhases: [
				{
					type: "multipleChoice",
					timeLimit: 30,
					instructions: "",
				},
			],
			questions: [],
			startDateTime: new Date(),
			endDateTime: new Date(),
			rooms: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "questions",
	});

	const {
		fields: phaseFields,
		append: appendPhase,
		remove: removePhase,
	} = useFieldArray({
		control: form.control,
		name: "examPhases",
	});

	const {
		fields: roomFields,
		append: appendRoom,
		remove: removeRoom,
	} = useFieldArray({
		control: form.control,
		name: "rooms",
	});

	const getPhaseType = (phaseIndex: number) => {
		return form.getValues(`examPhases.${phaseIndex}.type`);
	};

	const handleFormSubmit = async (data: QuizFormValues) => {
		try {
			// Validate that we have at least one room
			if (data.rooms.length === 0) {
				toast.error("Please add at least one room");
				return;
			}

			// Validate that all required fields in rooms are filled
			const hasInvalidRooms = data.rooms.some(
				(room) =>
					!room.name ||
					!room.passcode ||
					room.capacity < 1 ||
					room.timeLimit < 1
			);
			if (hasInvalidRooms) {
				toast.error("Please fill all required fields in rooms");
				return;
			}

			// Validate that all questions have correct answers
			const hasInvalidQuestions = data.questions.some((question) => {
				if (question.type === "multipleChoice") {
					return !question.correctAnswer || question.correctAnswer === "";
				}
				return typeof question.correctAnswer !== "boolean";
			});
			if (hasInvalidQuestions) {
				toast.error("Please select correct answers for all questions");
				return;
			}

			// Set default status and startedAt for rooms if not set
			const formattedData = {
				...data,
				rooms: data.rooms.map((room) => ({
					...room,
					status: "pending" as const,
					startedAt: null,
				})),
			};

			await onSubmit(formattedData);
			toast.success("Quiz created successfully!");
		} catch (error) {
			console.error("Error creating quiz:", error);
			toast.error("Failed to create quiz. Please try again.");
		}
	};

	const addNewQuestion = (phaseIndex: number) => {
		const phaseType = form.getValues(`examPhases.${phaseIndex}.type`);
		const defaultOptions =
			phaseType === "multipleChoice" ? DEFAULT_OPTIONS : [];
		const defaultAnswer = phaseType === "multipleChoice" ? "" : false;

		const newQuestion = {
			type: phaseType,
			question: "",
			options: defaultOptions,
			correctAnswer: defaultAnswer,
			timeLimit: 30,
			phase: phaseIndex + 1,
		};

		append(newQuestion);
		setShowOptions([...showOptions, phaseType === "multipleChoice"]);
	};

	const addNewPhase = () => {
		appendPhase({
			type: "multipleChoice",
			instructions: "",
			timeLimit: 30,
		});
	};

	const addNewRoom = () => {
		appendRoom({
			name: "",
			capacity: 1,
			timeLimit: 60,
			passcode: "",
			status: "pending" as const,
			startedAt: null,
		});
	};

	const moveToRooms = () => {
		// Validate questions before moving to rooms
		const questions = form.getValues("questions");
		if (questions.length === 0) {
			toast.error("Please add at least one question");
			return;
		}

		const hasEmptyQuestions = questions.some((q) => !q.question);
		if (hasEmptyQuestions) {
			toast.error("Please fill in all question fields");
			return;
		}

		setCurrentStep("rooms");
	};

	const moveBackToQuiz = () => {
		setCurrentStep("quiz");
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleFormSubmit)}
				className="space-y-8"
			>
				{currentStep === "quiz" ? (
					<>
						{/* Basic Quiz Info */}
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Quiz Name</FormLabel>
										<FormControl>
											<Input placeholder="Enter quiz name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description (Optional)</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Enter quiz description"
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Exam Phases */}
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-medium">Exam Phases</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addNewPhase}
								>
									<PlusCircle className="w-4 h-4 mr-2" />
									Add Phase
								</Button>
							</div>

							{phaseFields.map((phase, phaseIndex) => {
								const phaseType = getPhaseType(phaseIndex);
								return (
									<Card key={phase.id}>
										<CardContent className="pt-6 space-y-6">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<div className="flex items-center gap-4 mb-4">
														<h4 className="text-base font-medium">
															Phase {phaseIndex + 1}
														</h4>
														<FormField
															control={form.control}
															name={`examPhases.${phaseIndex}.type`}
															render={({ field }) => (
																<FormItem className="flex-1">
																	<Select
																		onValueChange={(
																			value: "multipleChoice" | "trueFalse"
																		) => {
																			field.onChange(value);

																			// Get all questions for this phase
																			const questions =
																				form.getValues("questions");
																			questions.forEach((_, qIndex) => {
																				if (
																					form.getValues(
																						`questions.${qIndex}.phase`
																					) ===
																					phaseIndex + 1
																				) {
																					// Update question type
																					form.setValue(
																						`questions.${qIndex}.type`,
																						value
																					);

																					// Reset options and correct answer based on new type
																					if (value === "trueFalse") {
																						form.setValue(
																							`questions.${qIndex}.options`,
																							[]
																						);
																						form.setValue(
																							`questions.${qIndex}.correctAnswer`,
																							false
																						);
																					} else {
																						form.setValue(
																							`questions.${qIndex}.options`,
																							DEFAULT_OPTIONS
																						);
																						form.setValue(
																							`questions.${qIndex}.correctAnswer`,
																							""
																						);
																					}

																					// Update showOptions state
																					const newShowOptions = [
																						...showOptions,
																					];
																					newShowOptions[qIndex] =
																						value === "multipleChoice";
																					setShowOptions(newShowOptions);
																				}
																			});
																		}}
																		value={field.value}
																	>
																		<FormControl>
																			<SelectTrigger className="w-[180px]">
																				<SelectValue placeholder="Select type" />
																			</SelectTrigger>
																		</FormControl>
																		<SelectContent>
																			<SelectItem value="multipleChoice">
																				Multiple Choice
																			</SelectItem>
																			<SelectItem value="trueFalse">
																				True/False
																			</SelectItem>
																		</SelectContent>
																	</Select>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<div className="space-y-4">
														<FormField
															control={form.control}
															name={`examPhases.${phaseIndex}.instructions`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Instructions</FormLabel>
																	<FormControl>
																		<Textarea
																			placeholder="Enter instructions for this phase"
																			className="min-h-[100px]"
																			{...field}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<FormField
															control={form.control}
															name={`examPhases.${phaseIndex}.timeLimit`}
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Time Limit (seconds)</FormLabel>
																	<FormControl>
																		<Input
																			type="number"
																			min="10"
																			placeholder="Enter time limit"
																			{...field}
																			value={field.value || ""}
																			onChange={(e) => {
																				const val = e.target.value;
																				field.onChange(
																					val ? parseInt(val) : 30
																				);
																			}}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
												{phaseIndex > 0 && (
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removePhase(phaseIndex)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												)}
											</div>

											{/* Questions for this phase */}
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<h5 className="text-sm font-medium">Questions</h5>
													<Button
														type="button"
														variant="outline"
														size="sm"
														onClick={() => addNewQuestion(phaseIndex)}
													>
														<PlusCircle className="w-4 h-4 mr-2" />
														Add Question
													</Button>
												</div>

												{fields
													.filter(
														(f) =>
															form.getValues(
																`questions.${fields.indexOf(f)}.phase`
															) ===
															phaseIndex + 1
													)
													.map((field) => {
														const index = fields.indexOf(field);
														const isMultipleChoice =
															phaseType === "multipleChoice";

														return (
															<Card key={field.id}>
																<CardContent className="pt-6 space-y-4">
																	<div className="flex justify-between items-start">
																		<FormField
																			control={form.control}
																			name={`questions.${index}.question`}
																			render={({ field }) => (
																				<FormItem className="flex-1 mr-4">
																					<FormLabel>Question</FormLabel>
																					<FormControl>
																						<Textarea
																							placeholder="Enter your question"
																							className="min-h-[100px]"
																							{...field}
																						/>
																					</FormControl>
																					<FormMessage />
																				</FormItem>
																			)}
																		/>
																		<Button
																			type="button"
																			variant="ghost"
																			size="icon"
																			onClick={() => remove(index)}
																		>
																			<Trash2 className="w-4 h-4" />
																		</Button>
																	</div>

																	{isMultipleChoice && (
																		<div className="space-y-4">
																			<FormField
																				control={form.control}
																				name={`questions.${index}.options`}
																				render={() => (
																					<FormItem>
																						<FormLabel>Options</FormLabel>
																						<div className="space-y-2">
																							{ALPHABET.map(
																								(letter, optionIndex) => (
																									<FormField
																										key={optionIndex}
																										control={form.control}
																										name={`questions.${index}.options.${optionIndex}`}
																										render={({ field }) => (
																											<FormItem>
																												<FormControl>
																													<div className="flex items-center gap-2">
																														<span className="w-6 text-sm font-medium">
																															{letter}.
																														</span>
																														<Input
																															placeholder={`Option ${letter}`}
																															{...field}
																															onChange={(e) => {
																																field.onChange(
																																	e.target.value
																																);
																																// Reset correct answer if the selected option is being cleared
																																const currentAnswer =
																																	form.getValues(
																																		`questions.${index}.correctAnswer`
																																	);
																																const currentOptions =
																																	form.getValues(
																																		`questions.${index}.options`
																																	) as string[];
																																if (
																																	currentAnswer ===
																																		currentOptions[
																																			optionIndex
																																		] &&
																																	!e.target
																																		.value
																																) {
																																	form.setValue(
																																		`questions.${index}.correctAnswer`,
																																		""
																																	);
																																}
																															}}
																														/>
																													</div>
																												</FormControl>
																											</FormItem>
																										)}
																									/>
																								)
																							)}
																						</div>
																						<FormMessage />
																					</FormItem>
																				)}
																			/>

																			<FormField
																				control={form.control}
																				name={`questions.${index}.correctAnswer`}
																				render={({ field }) => {
																					// Watch options for this question
																					const options = form.watch(
																						`questions.${index}.options`
																					) as string[];

																					return (
																						<FormItem>
																							<FormLabel>
																								Correct Answer
																							</FormLabel>
																							<Select
																								onValueChange={(value) => {
																									field.onChange(
																										options[parseInt(value)]
																									);
																								}}
																								value={(() => {
																									const currentAnswer =
																										field.value as string;
																									const optionIndex =
																										options.findIndex(
																											(opt) =>
																												opt === currentAnswer
																										);
																									return optionIndex >= 0
																										? optionIndex.toString()
																										: "";
																								})()}
																							>
																								<FormControl>
																									<SelectTrigger>
																										<SelectValue placeholder="Select correct answer" />
																									</SelectTrigger>
																								</FormControl>
																								<SelectContent>
																									{ALPHABET.map(
																										(letter, optionIndex) => {
																											const option =
																												options[optionIndex] ||
																												"";
																											return (
																												<SelectItem
																													key={optionIndex}
																													value={optionIndex.toString()}
																													disabled={!option}
																												>
																													{letter}.{" "}
																													{option || "(empty)"}
																												</SelectItem>
																											);
																										}
																									)}
																								</SelectContent>
																							</Select>
																							<FormMessage />
																						</FormItem>
																					);
																				}}
																			/>
																		</div>
																	)}

																	{!isMultipleChoice && (
																		<FormField
																			control={form.control}
																			name={`questions.${index}.correctAnswer`}
																			render={({ field }) => (
																				<FormItem>
																					<FormLabel>Correct Answer</FormLabel>
																					<Select
																						onValueChange={(value) => {
																							field.onChange(value === "true");
																						}}
																						value={String(field.value)}
																					>
																						<FormControl>
																							<SelectTrigger>
																								<SelectValue placeholder="Select correct answer" />
																							</SelectTrigger>
																						</FormControl>
																						<SelectContent>
																							<SelectItem value="true">
																								True
																							</SelectItem>
																							<SelectItem value="false">
																								False
																							</SelectItem>
																						</SelectContent>
																					</Select>
																					<FormMessage />
																				</FormItem>
																			)}
																		/>
																	)}

																	<FormField
																		control={form.control}
																		name={`questions.${index}.timeLimit`}
																		render={({ field }) => (
																			<FormItem>
																				<FormLabel>
																					Time Limit (seconds)
																				</FormLabel>
																				<FormControl>
																					<Input
																						type="number"
																						min="10"
																						placeholder="Enter time limit"
																						{...field}
																						value={field.value || ""}
																						onChange={(e) => {
																							const val = e.target.value;
																							field.onChange(
																								val ? parseInt(val) : 30
																							);
																						}}
																					/>
																				</FormControl>
																				<FormMessage />
																			</FormItem>
																		)}
																	/>
																</CardContent>
															</Card>
														);
													})}
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>

						{/* Quiz Schedule */}
						<Card>
							<CardContent className="pt-6">
								<h3 className="text-lg font-medium mb-4">Quiz Schedule</h3>
								<div className="flex gap-4">
									<FormField
										control={form.control}
										name="startDateTime"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel>Start Date & Time</FormLabel>
												<FormControl>
													<Input
														type="datetime-local"
														{...field}
														value={
															field.value
																? new Date(field.value)
																		.toISOString()
																		.slice(0, 16)
																: ""
														}
														onChange={(e) =>
															field.onChange(new Date(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="endDateTime"
										render={({ field }) => (
											<FormItem className="flex-1">
												<FormLabel>End Date & Time</FormLabel>
												<FormControl>
													<Input
														type="datetime-local"
														{...field}
														value={
															field.value
																? new Date(field.value)
																		.toISOString()
																		.slice(0, 16)
																: ""
														}
														onChange={(e) =>
															field.onChange(new Date(e.target.value))
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						<Button
							type="button"
							className="w-full"
							onClick={moveToRooms}
							disabled={fields.length === 0}
						>
							Next: Add Quiz Rooms
						</Button>
					</>
				) : (
					<>
						<div className="flex items-center justify-between mb-6">
							<Button type="button" variant="outline" onClick={moveBackToQuiz}>
								← Back to Quiz Details
							</Button>
							<h2 className="text-xl font-semibold">Quiz Rooms</h2>
						</div>

						{/* Quiz Rooms */}
						<Card>
							<CardContent className="pt-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-medium">Quiz Rooms</h3>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addNewRoom}
									>
										<PlusCircle className="w-4 h-4 mr-2" />
										Add Room
									</Button>
								</div>

								<div className="space-y-4">
									{roomFields.map((room, index) => (
										<Card key={room.id}>
											<CardContent className="pt-6 space-y-4">
												<div className="flex justify-between items-start">
													<FormField
														control={form.control}
														name={`rooms.${index}.name`}
														render={({ field }) => (
															<FormItem className="flex-1 mr-4">
																<FormLabel>Room Name</FormLabel>
																<FormControl>
																	<Input
																		placeholder="Enter room name"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => removeRoom(index)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>

												<div className="grid grid-cols-2 gap-4">
													<FormField
														control={form.control}
														name={`rooms.${index}.capacity`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Capacity</FormLabel>
																<FormControl>
																	<Input
																		type="number"
																		min="1"
																		placeholder="Enter room capacity"
																		{...field}
																		onChange={(e) => {
																			const val = e.target.value;
																			if (val === "") {
																				field.onChange("");
																			} else {
																				const num = parseInt(val);
																				if (!isNaN(num) && num >= 1) {
																					field.onChange(num);
																				}
																			}
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>

													<FormField
														control={form.control}
														name={`rooms.${index}.timeLimit`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Time Limit (minutes)</FormLabel>
																<FormControl>
																	<Input
																		type="number"
																		min="1"
																		placeholder="Enter time limit"
																		{...field}
																		value={field.value || ""}
																		onChange={(e) => {
																			const val = e.target.value;
																			field.onChange(val ? parseInt(val) : 60);
																		}}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>

												<FormField
													control={form.control}
													name={`rooms.${index}.passcode`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Room Passcode</FormLabel>
															<FormControl>
																<Input
																	type="text"
																	placeholder="Enter room passcode"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`rooms.${index}.status`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Status</FormLabel>
															<FormControl>
																<Select
																	onValueChange={field.onChange}
																	value={field.value}
																	disabled
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<SelectItem value="pending">
																			Pending
																		</SelectItem>
																		<SelectItem value="inProgress">
																			In Progress
																		</SelectItem>
																		<SelectItem value="completed">
																			Completed
																		</SelectItem>
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>

						<Button type="submit" className="w-full">
							Create Quiz
						</Button>
					</>
				)}
			</form>
		</Form>
	);
}
