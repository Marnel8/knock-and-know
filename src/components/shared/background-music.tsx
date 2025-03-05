"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = () => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		// Create audio element
		const audio = new Audio("/sound/knk-bg-music.mp3");
		audio.loop = true;
		audioRef.current = audio;

		// Cleanup
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}
		};
	}, []);

	const toggleAudio = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch((error) => {
					console.log("Audio playback failed:", error);
				});
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<button
			onClick={toggleAudio}
			className="fixed cursor-pointer bottom-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 ease-in-out border-2 border-white/30"
			title={isPlaying ? "Mute background music" : "Play background music"}
		>
			{isPlaying ? (
				<Volume2 className="w-6 h-6 text-white" />
			) : (
				<VolumeX className="w-6 h-6 text-white" />
			)}
		</button>
	);
};

export default BackgroundMusic;
