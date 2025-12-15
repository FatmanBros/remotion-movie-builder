import { interpolate, spring } from 'remotion';

export interface EnterEffectParams {
	frame: number;
	fps: number;
	charIndex: number;
	totalChars: number;
}

export interface EnterEffectStyle {
	opacity: number;
	transform: string;
	scale?: number;
}

/**
 * Drop effect - Text drops from above with gravity effect
 * Each character drops sequentially with a spring animation
 */
export const drop = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation for bouncy drop effect
	const dropProgress = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 15,
			mass: 1,
			stiffness: 100,
		},
	});

	// Start position above screen
	const translateY = interpolate(dropProgress, [0, 1], [-100, 0], {
		extrapolateRight: 'clamp',
	});

	// Fade in as it drops
	const opacity = interpolate(effectiveFrame, [0, 10], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `translateY(${translateY}%)`,
	};
};
