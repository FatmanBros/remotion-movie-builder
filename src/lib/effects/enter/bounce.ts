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
 * Bounce effect - Text bounces in with spring physics
 * Each character bounces with an exaggerated spring animation
 */
export const bounce = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation with high bounce (low damping)
	const bounceProgress = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 8, // Low damping for more bounce
			mass: 0.8,
			stiffness: 150,
			overshootClamping: false, // Allow overshoot for bounce effect
		},
	});

	// Scale with bounce effect
	const scale = interpolate(bounceProgress, [0, 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Add a slight vertical bounce
	const translateY = interpolate(
		bounceProgress,
		[0, 0.5, 1],
		[50, -10, 0],
		{
			extrapolateRight: 'clamp',
		}
	);

	// Quick fade in
	const opacity = interpolate(effectiveFrame, [0, 5], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `scale(${scale}) translateY(${translateY}%)`,
		scale,
	};
};
