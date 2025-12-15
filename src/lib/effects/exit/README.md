# Exit Effects

This directory contains exit animation effects for text in Remotion videos.

## Available Effects

1. **dropOut** - Text falls down and disappears
2. **riseOut** - Text rises up and disappears
3. **slideOut** - Text slides out to left or right
4. **zoomOut** - Text shrinks and disappears
5. **dissolve** - Text fades out with dissolve effect
6. **scatter** - Characters scatter in random directions

## Usage

Each effect function takes the following parameters:

```typescript
(
  frame: number,          // Current frame number
  fps: number,           // Frames per second
  charIndex: number,     // Index of the character (0-based)
  totalChars: number,    // Total number of characters
  durationFrames: number // Duration of the exit animation in frames
) => React.CSSProperties
```

### Example

```typescript
import { useCurrentFrame, useVideoConfig } from "remotion";
import { dropOut } from "./lib/effects/exit";

const MyComponent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const text = "Hello World";
  const durationFrames = fps * 2; // 2 seconds

  return (
    <div>
      {text.split("").map((char, index) => {
        const style = dropOut(frame, fps, index, text.length, durationFrames);
        return (
          <span key={index} style={{ display: "inline-block", ...style }}>
            {char}
          </span>
        );
      })}
    </div>
  );
};
```

## Effect Details

### dropOut
Characters fall downward with slight rotation and fade out.

### riseOut
Characters float upward while shrinking and fading out.

### slideOut
Characters slide horizontally (left or right) and fade out. The `slideOut` function accepts an optional 6th parameter for direction:
```typescript
slideOut(frame, fps, charIndex, totalChars, durationFrames, "left")
```

### zoomOut
Characters shrink toward their center with rotation and fade out.

### dissolve
Characters randomly fade, scale, and blur at different rates creating a dissolve effect.

### scatter
Characters scatter in random directions with rotation and scaling, creating an explosive effect.
