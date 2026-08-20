import { animate, stagger } from "motion"

// --- Reusable animation variants ---

const ease = [0.22, 1, 0.36, 1]

const fadeUp = { opacity: [0, 1], y: [16, 0] }
const fadeUpSubtle = { opacity: [0, 1], y: [8, 0] }
const fadeIn = { opacity: [0, 1] }

// --- Reduced motion handling ---

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches

if (prefersReducedMotion) {
  document
    .querySelectorAll("[data-hero]")
    .forEach((el) => (el.style.opacity = "1"))
} else {
  // --- Hero entrance (fires on page load) ---

  const heroSequence = [
    { name: "heading-1", keyframes: fadeUp, duration: 0.6, delay: 1 },
    { name: "heading-2", keyframes: fadeUp, duration: 0.6, delay: 1.2 },
    { name: "strapline", keyframes: fadeUpSubtle, duration: 0.7, delay: 1.45 },
    { name: "ctas", keyframes: fadeIn, duration: 0.5, delay: 1.65 },
  ]

  heroSequence.forEach(({ name, keyframes, duration, delay }) => {
    const el = document.querySelector(`[data-hero="${name}"]`)
    if (el) animate(el, keyframes, { duration, delay, easing: ease })
  })

  // --- Scroll-triggered reveals ---

  const hide = (el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(16px)"
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target

        el.style.opacity = ""
        el.style.transform = ""
        animate(el, fadeUp, { duration: 0.6, easing: ease })
        revealObserver.unobserve(el)
      })
    },
    { threshold: 0.1, rootMargin: "0px 0px -30% 0px" }
  )

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const container = entry.target
        const children = [...container.children]

        children.forEach((child) => {
          child.style.opacity = ""
          child.style.transform = ""
        })
        animate(children, fadeUp, {
          duration: 0.5,
          delay: stagger(0.12),
          easing: ease,
        })
        staggerObserver.unobserve(container)
      })
    },
    { threshold: 0.08, rootMargin: "0px 0px -30% 0px" }
  )

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    hide(el)
    revealObserver.observe(el)
  })

  document.querySelectorAll("[data-reveal-children]").forEach((container) => {
    ;[...container.children].forEach(hide)
    staggerObserver.observe(container)
  })
}
