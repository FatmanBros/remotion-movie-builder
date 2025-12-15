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

export type SlideDirection = 'left' | 'right';

/**
 * Slide in effect - Text slides in from left or right
 * Each character slides sequentially with a spring animation
 */
export const slideIn = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number,
	direction: SlideDirection = 'left'
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation for smooth slide
	const slideProgress = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 18,
			mass: 1,
			stiffness: 140,
		},
	});

	// Determine start position based on direction
	const startX = direction === 'left' ? -120 : 120;
	const translateX = interpolate(slideProgress, [0, 1], [startX, 0], {
		extrapolateRight: 'clamp',
	});

	// Fade in as it slides
	const opacity = interpolate(effectiveFrame, [0, 8], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `translateX(${translateX}%)`,
	};
};
