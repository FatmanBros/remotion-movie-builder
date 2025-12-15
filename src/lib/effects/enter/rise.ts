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
 * Rise effect - Text rises from below with smooth animation
 * Each character rises sequentially with a spring animation
 */
export const rise = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation for smooth rise
	const riseProgress = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 20,
			mass: 1,
			stiffness: 120,
		},
	});

	// Start position below screen
	const translateY = interpolate(riseProgress, [0, 1], [100, 0], {
		extrapolateRight: 'clamp',
	});

	// Fade in as it rises
	const opacity = interpolate(effectiveFrame, [0, 8], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `translateY(${translateY}%)`,
	};
};
