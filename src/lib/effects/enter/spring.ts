import { interpolate, spring as remotionSpring } from 'remotion';

export interface EnterEffectStyle {
	opacity: number;
	transform: string;
	scale?: number;
}

/**
 * Spring effect - Text springs in with smooth physics
 * Each character scales up with spring animation and moves up
 */
export const spring = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation for scale
	const scaleProgress = remotionSpring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 12,
			stiffness: 200,
			mass: 0.5,
		},
	});

	// Move up from below
	const translateY = interpolate(
		effectiveFrame,
		[0, 8],
		[20, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	// Fade in
	const opacity = interpolate(effectiveFrame, [0, 3], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `scale(${scaleProgress}) translateY(${translateY}px)`,
		scale: scaleProgress,
	};
};
