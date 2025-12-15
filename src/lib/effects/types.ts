/**
 * Configuration for effect animations
 */
export type EffectConfig = {
	duration: number;
	delay?: number;
	easing?: string;
	intensity?: number;
};

/**
 * Enter effect types for animations when elements appear
 */
export type EnterEffect =
	| 'drop'
	| 'rise'
	| 'slideInLeft'
	| 'slideInRight'
	| 'zoomIn'
	| 'bounce'
	| 'typewriter'
	| 'spring'
	| 'blur'
	| 'rotate'
	| 'elastic';

/**
 * Exit effect types for animations when elements disappear
 */
export type ExitEffect =
	| 'dropOut'
	| 'riseOut'
	| 'slideOutLeft'
	| 'slideOutRight'
	| 'zoomOut'
	| 'dissolve'
	| 'scatter'
	| 'springOut';

/**
 * Emphasis effect types for highlighting elements
 */
export type EmphasisEffect =
	| 'pulse'
	| 'shake'
	| 'glow'
	| 'wave'
	| 'rainbow'
	| 'neon'
	| 'kirakira';

/**
 * Complete configuration for telop (text overlay) effects
 */
export type TelopEffectConfig = {
	enter?: {
		effect: EnterEffect;
		config?: EffectConfig;
	};
	exit?: {
		effect: ExitEffect;
		config?: EffectConfig;
	};
	emphasis?: {
		effect: EmphasisEffect;
		config?: EffectConfig;
	};
};
