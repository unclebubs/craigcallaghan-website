import { animate, stagger } from "motion"

// --- Reusable animation variants ---

const ease = [0.22, 1, 0.36, 1]

const fadeUp = { opacity: [0, 1], y: [16, 0] }
const fadeUpSubtle = { opacity: [0, 1], y: [8, 0] }
const fadeIn = { opacity: [0, 1] }
const wipeInLeft = { opacity: [0, 1], x: [-32, 0], clipPath: ["inset(0 100% 0 0)", "inset(0 0% -10px 0)"] }

// --- Reduced motion handling ---

const cookieBanner = document.getElementById("cookie-banner")
const cookieBannerDismiss = document.getElementById("cookie-banner-dismiss")
const cookieBannerKey = "craig-cookie-banner-dismissed"

if (cookieBanner && cookieBannerDismiss) {
  try {
    const dismissed = window.localStorage.getItem(cookieBannerKey) === "true"
    if (!dismissed) {
      cookieBanner.classList.remove("hidden")
      cookieBanner.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 350,
          easing: "ease-out",
        }
      )
    }

    cookieBannerDismiss.addEventListener("click", () => {
      window.localStorage.setItem(cookieBannerKey, "true")
      cookieBanner.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(18px)" },
        ],
        {
          duration: 250,
          easing: "ease-in",
          fill: "forwards",
        }
      )

      window.setTimeout(() => cookieBanner.classList.add("hidden"), 220)
    })
  } catch (error) {
    cookieBanner.classList.remove("hidden")
  }
}

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
const focusableLinks = document.querySelectorAll("a, button")
focusableLinks.forEach((element) => {
  if (!element.classList.contains("focus-visible")) {
    element.classList.add(focusRing)
  }
})

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
    { name: "eyebrow", duration: 0.45, delay: 0.1, transform: "translateY(0)" },
    { name: "heading-1", duration: 0.7, delay: 0.25, transform: "translateX(0)", clipPath: "inset(0 0% 0 0)" },
    { name: "heading-2", duration: 0.7, delay: 0.65, transform: "translateX(0)", clipPath: "inset(0 0% 0 0)" },
    { name: "strapline", duration: 0.7, delay: 1.25, transform: "translateY(0)" },
    { name: "ctas", duration: 0.5, delay: 1.25, transform: "translateY(0)" },
  ]

  heroSequence.forEach(({ name, duration, delay, transform, clipPath }) => {
    const el = document.querySelector(`[data-hero="${name}"]`)
    if (!el) return

    if (name === "heading-1" || name === "heading-2") {
      el.style.transform = "translateX(-32px)"
      el.style.clipPath = "inset(0 100% 0 0)"
    } else {
      el.style.transform = "translateY(12px)"
      el.style.clipPath = "inset(0 0% 0 0)"
    }

    const start = () => {
      el.style.transition = `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s, clip-path ${duration}s ease ${delay}s`
      el.style.opacity = "1"
      el.style.transform = transform
      el.style.clipPath = clipPath || "inset(0 0% 0 0)"
    }

    window.requestAnimationFrame(start)
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
