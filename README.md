# 😎 GSAP Text Animator

A lightweight, customizable text animation library built with GSAP and ScrollTrigger. Create beautiful, scroll-triggered text animations with ease.

## Features

- 🎯 Three animation styles out of the box
  - Letter-by-letter cascade
  - Smooth word flow
  - Staggered word reveal
- 📜 ScrollTrigger integration
- 🎨 Automatic style injection
- 🛠 Debug mode
- 📦 Lightweight and efficient

## Installation

Using CDN:

```html
<!-- Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<!-- Text Animator -->
<script src="path/to/textAnimator.js"></script>
```

Using npm:

```bash
npm install gsap-text-animator
```

Using pnpm:

```bash
pnpm add gsap-text-animator
```

## Quick Start

```html
<!-- Initialize -->
<script>
  const animator = new TextAnimator();
</script>

<!-- Use in HTML -->
<h1 class="animate-text-letters">Letter by letter animation</h1>
<h2 class="animate-text-words">Word by word animation</h2>
<h3 class="animate-text-staggered">Staggered word animation</h3>
```

## Configuration Options

```javascript
const animator = new TextAnimator({
  useScrollTrigger: true, // Enable/disable scroll triggering
  scrollTriggerOffset: 100, // Pixels from bottom of viewport
  defaultDuration: 1, // Animation duration in seconds
  defaultEase: "power3.out", // Default easing function
  autoInjectStyles: true, // Automatically inject required CSS
  debug: false, // Enable/disable debug mode
});
```

## Animation Classes

1. `animate-text-letters`

   - Animates each letter individually
   - Perfect for headings and short text

   ```html
   <h1 class="animate-text-letters">Animate Each Letter</h1>
   ```

2. `animate-text-words`

   - Animates each word as a unit
   - Great for sentences and paragraphs

   ```html
   <p class="animate-text-words">Each word animates smoothly</p>
   ```

3. `animate-text-staggered`
   - Staggers word animations
   - Ideal for longer text blocks
   ```html
   <div class="animate-text-staggered">Words appear with staggered timing</div>
   ```

## Debug Mode

Enable debugging to see detailed information about animations:

```javascript
// Enable on initialization
const animator = new TextAnimator({ debug: true });

// Or toggle anytime
animator.setDebug(true); // Enable
animator.setDebug(false); // Disable
```

Debug mode provides information about:

- Initialization process
- Found elements
- Animation creation
- Errors and warnings
- Refresh operations

## Customizing Animations

### Using Manual Styles

If you prefer to manage styles yourself, you can disable automatic style injection:

```javascript
const animator = new TextAnimator({
  autoInjectStyles: false,
});
```

Then add these required styles to your CSS file:

```css
/* Base styles */
[class*="animate-text"] {
  opacity: 1;
}

/* Letter cascade animation */
.animate-text-letters .char {
  display: inline-block;
  opacity: 0;
  transform: translateY(40px);
}

/* Word flow animation */
.animate-text-words .word-wrapper {
  display: inline-block;
  overflow: hidden;
  margin-right: 0.3em;
}
.animate-text-words .word {
  display: inline-block;
  transform: translateY(100%);
}

/* Staggered slide animation */
.animate-text-staggered .word-wrapper {
  display: inline-block;
  overflow: hidden;
  margin-right: 0.3em;
  opacity: 0;
  transform: translateY(50%);
}
```

### Customizing Default Styles

1. Adjust Word Spacing

```css
.animate-text-words .word-wrapper {
  margin-right: 1em; /* Default is 0.3em */
}
```

2. Change Animation Distance

```css
.animate-text-letters .char {
  transform: translateY(60px); /* Default is 40px */
}
```

3. Modify Opacity

```css
.animate-text-staggered .word-wrapper {
  opacity: 0.5; /* Default is 0 */
}
```

## Dynamic Content

For dynamically added content, use the refresh method:

```javascript
// After adding new content
animator.refresh();
```

## Error Handling

The library includes comprehensive error checking:

```javascript
try {
  const animator = new TextAnimator({ debug: true });
} catch (error) {
  console.error("Initialization failed:", error.message);
}
```

Common errors:

- Missing dependencies
- Invalid options
- Missing elements
- Refresh failures

## Browser Support

- All modern browsers
- IE11 and up (with appropriate polyfills)

## Dependencies

- GSAP (>=3.0.0)
- jQuery (>=3.0.0)
- ScrollTrigger plugin (optional)

## Contributing [WIP]

Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

## License

MIT © Rakesh Mandal
