/**
 * Enter Effects for Remotion animations
 *
 * Each effect function takes (frame, fps, charIndex, totalChars) parameters
 * and returns { opacity, transform, scale } style values for animating text.
 */

export { drop } from './drop';
export { rise } from './rise';
export { slideIn, type SlideDirection } from './slideIn';
export { zoomIn } from './zoomIn';
export { bounce } from './bounce';
export { typewriter } from './typewriter';
export { blur } from './blur';
export { rotate } from './rotate';
export { elastic } from './elastic';
export { spring } from './spring';
export { fadeIn } from './fadeIn';
export { swing } from './swing';
export { flip } from './flip';

export type { EnterEffectParams, EnterEffectStyle } from './drop';
