import { animate } from "motion"

// --- Reusable animation variants ---

const ease = [0.16, 1, 0.3, 1]

const fadeUp = { opacity: [0, 1], y: [12, 0] }
const fadeUpSubtle = { opacity: [0, 1], y: [8, 0] }
const fadeIn = { opacity: [0, 1] }

// --- Hero entrance sequence ---

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

const heroElements = document.querySelectorAll("[data-hero]")

if (prefersReducedMotion) {
  heroElements.forEach((el) => (el.style.opacity = "1"))
} else {
  const sequence = [
    { name: "heading-1", keyframes: fadeUp,       duration: 0.6, delay: 0 },
    { name: "heading-2", keyframes: fadeUp,       duration: 0.6, delay: 0.2 },
    { name: "strapline", keyframes: fadeUpSubtle, duration: 0.7, delay: 0.45 },
    { name: "ctas",      keyframes: fadeIn,       duration: 0.5, delay: 0.65 },
  ]

  sequence.forEach(({ name, keyframes, duration, delay }) => {
    const el = document.querySelector(`[data-hero="${name}"]`)
    if (el) {
      animate(el, keyframes, { duration, delay, easing: ease })
    }
  })
}
