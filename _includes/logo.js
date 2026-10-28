addEventListener('DOMContentLoaded', (event) => {
    const el = document.createElement('img')
    el.src = '/clawr-doc/images/rawry-simplified.png'
    el.alt = 'Rawry'
    el.className = 'clawr-logo'
    document.body.appendChild(el)
})

let ticking = false

window.addEventListener('scroll', () => {
    if (ticking) return

    const el = document.querySelector('.clawr-logo')
    if (!el) return

    ticking = true
    requestAnimationFrame(() => {
        // Normalize scroll to 0-1 range (adjust based on when scaling ends)
        const scrollProgress = Math.min(window.scrollY / 300, 1)
        const easedProgress = easing.easeOutCubic(scrollProgress)

        const height = Math.max(210 - easedProgress * 140, 70)
        const top = Math.max(0, Math.min(10, 10 - easedProgress * 10))

        el.style.height = `${height}px`
        el.style.top = `${top}px`
        ticking = false
    })
})

// Easing functions
const easing = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
}
