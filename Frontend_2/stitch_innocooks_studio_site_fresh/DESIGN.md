---
name: Industrial Kinetic
colors:
  surface: '#141314'
  surface-dim: '#141314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0f0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2b292b'
  surface-container-highest: '#363435'
  on-surface: '#e6e1e2'
  on-surface-variant: '#ddc0b8'
  inverse-surface: '#e6e1e2'
  inverse-on-surface: '#313031'
  outline: '#a58b83'
  outline-variant: '#56423c'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1900'
  primary-container: '#e17149'
  on-primary-container: '#511500'
  inverse-primary: '#a0401c'
  secondary: '#ffb4a7'
  on-secondary: '#680200'
  secondary-container: '#ff553f'
  on-secondary-container: '#5b0200'
  tertiary: '#72d5e4'
  on-tertiary: '#00363d'
  tertiary-container: '#329eac'
  on-tertiary-container: '#002f35'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#802a06'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a7'
  on-secondary-fixed: '#400100'
  on-secondary-fixed-variant: '#920500'
  tertiary-fixed: '#96f1ff'
  tertiary-fixed-dim: '#72d5e4'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f57'
  background: '#141314'
  on-background: '#e6e1e2'
  surface-variant: '#363435'
  deep-onyx: '#121112'
  stark-white: '#FFFFFF'
  industrial-gray: '#241F21'
  kinetic-orange: '#c45b35'
  signal-red: '#ff210f'
typography:
  display-2xl:
    fontFamily: Bricolage Grotesque
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 100px
    letterSpacing: -0.05em
  display-xl:
    fontFamily: Bricolage Grotesque
    fontSize: 80px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style

This design system embodies a "2026 Industrial" aesthetic—a fusion of Swiss precision, digital brutalism, and premium high-contrast editorial design. It is built for a target audience that values technical mastery, structural clarity, and assertive visual communication.

The style is **Bold & High-Contrast**. It rejects soft gradients and decorative flourishes in favor of raw structural integrity. Key characteristics include:
- **Structural Brutalism:** Layouts are defined by rigid grids and visible "seams," creating a sense of architectural permanence.
- **Kinetic Precision:** While the static visuals are heavy and grounded, the interaction model is fast, sharp, and immersive, utilizing rapid transitions and high-frequency motion.
- **Premium Rawness:** The interface should feel like a high-end physical machine—cold, efficient, and meticulously engineered.

## Colors

The palette is anchored in **Deep Onyx (#121112)** to provide a void-like depth, allowing the high-saturation accents to vibrate against the background. 

- **Primary (Kinetic Orange):** Used for critical functional elements and brand markers. It is a sophisticated, burnt orange that suggests industrial machinery.
- **Secondary (Signal Red):** Reserved for high-alert interactions, warnings, or ultra-high-impact display text.
- **Neutral/Background:** The system primarily operates in a dark mode. Use Stark White sparingly for maximum contrast in typography.
- **Functional Grays:** Use #241F21 for subtle structural borders or container backgrounds to maintain a monochromatic hierarchy without losing the "dark" intensity.

## Typography

Typography is the primary visual driver of this design system. 

- **Bricolage Grotesque:** Used for all display and headline roles. It must be set with **tight tracking** and **tight line-height** (often less than 1:1 for large scales) to create a dense, high-impact block of text.
- **Hanken Grotesk:** Provides a clean, contemporary contrast for body copy, ensuring legibility against the aggressive headlines.
- **JetBrains Mono:** Utilized for technical data, labels, and small UI markers to reinforce the industrial, "machine-read" aesthetic.

**Rule:** Headlines should often break traditional margins or span the full width of the viewport to create a sense of overwhelming scale.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is contained within a 12-column grid, but background elements and large typography often bleed to the edges.

- **Grid:** 12 columns on desktop, 4 on mobile.
- **Gutters:** Tight 24px gutters to maintain the "compacted" industrial feel.
- **Rhythm:** Spacing follows a strict 4px base unit. Vertical rhythm should be aggressive—either very tight to group elements or very large to create dramatic breaks.
- **Structural Clarity:** Use hairline borders (1px) in #241F21 or #FFFFFF (10% opacity) to define regions rather than relying on whitespace alone.

## Elevation & Depth

This design system avoids traditional shadows and depth. It is a **Flat-Structural** system.

- **Tonal Layering:** Depth is achieved through "stacked" surfaces. The base is Deep Onyx (#121112), and active containers or hover states lift to Industrial Gray (#241F21).
- **Outlines:** Use 1px solid borders for all interactive containers. No blurs, no soft shadows.
- **Masking:** Use hard-edge masking transitions for image reveals and content loading to simulate mechanical shutters.

## Shapes

The shape language is **unapologetically sharp**. 

- **Zero Radius:** Every button, input, and card must have a 0px border radius. This reinforces the industrial and precise nature of the brand.
- **Geometric Strictness:** Use squares and rectangles exclusively. Circles are only permitted for very specific functional icons (e.g., status indicators) but should be avoided for structural containers.

## Components

### Buttons
- **Primary:** Stark White background with Black text. 0px radius. Hover state: Kinetic Orange background.
- **Ghost:** 1px Stark White border, transparent background. Text in Stark White.
- **Interaction:** On hover, buttons should trigger a slight "glitch" or immediate color flip with 0ms transition for a high-response feel.

### Input Fields
- **Style:** Bottom-border only or full-box with 1px gray border. 
- **Focus:** Border color flips to Kinetic Orange instantly. Label moves to a 10px Mono font above the input.

### Cards
- **Structure:** No shadows. Defined by 1px borders. 
- **Content:** Large headline at the top-left, technical metadata (Label-Mono) at the bottom-right.

### Lists
- Separate list items with 1px horizontal rules. 
- Use JetBrains Mono for index numbers (e.g., 01, 02, 03) to create a systematic table-of-contents feel.

### Navigation
- Full-screen "Overlay" menu for mobile/tablet using massive Bricolage Grotesque links. 
- Desktop uses a fixed-position perimeter frame for core links.