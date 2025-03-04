// components/MotionDiv.tsx
"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionDivProps extends MotionProps {
	children: ReactNode;
}

export default function MotionDiv({ children, ...props }: MotionDivProps) {
	return <motion.div {...props}>{children}</motion.div>;
}
