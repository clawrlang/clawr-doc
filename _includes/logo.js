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

    const navEl = document.querySelector('.nav')
    const logoEl = document.querySelector('.clawr-logo')
    if (!logoEl) return

    ticking = true
    requestAnimationFrame(() => {
        const logoProgress = easing.easeOutCubic(
            Math.min(window.scrollY / 400, 1),
        )
        const navProgress = easing.easeOutCubic(
            Math.min(window.scrollY / 120, 1),
        )

        const height = Math.max(250 - logoProgress * 180, 70)
        const top = Math.max(0, Math.min(10, 10 - logoProgress * 10))
        const padding = Math.max(15 - navProgress * 10, 5)
        const border = Math.max(10 - navProgress * 5, 5)

        logoEl.style.height = `${height}px`
        logoEl.style.top = `${top}px`
        navEl.style.padding = `${padding}px 0`
        navEl.style.borderBottomWidth = `${border}px`
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
