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
 * Zoom in effect - Text zooms in from small to normal size
 * Each character zooms sequentially with a spring animation
 */
export const zoomIn = (
	frame: number,
	fps: number,
	charIndex: number,
	totalChars: number
): EnterEffectStyle => {
	const delay = charIndex * 2; // Stagger delay per character
	const effectiveFrame = Math.max(0, frame - delay);

	// Spring animation for bouncy zoom
	const zoomProgress = spring({
		frame: effectiveFrame,
		fps,
		config: {
			damping: 12,
			mass: 1,
			stiffness: 100,
			overshootClamping: false,
		},
	});

	// Scale from 0 to 1
	const scale = interpolate(zoomProgress, [0, 1], [0, 1], {
		extrapolateRight: 'clamp',
	});

	// Fade in as it zooms
	const opacity = interpolate(effectiveFrame, [0, 6], [0, 1], {
		extrapolateRight: 'clamp',
		extrapolateLeft: 'clamp',
	});

	return {
		opacity,
		transform: `scale(${scale})`,
		scale,
	};
};
