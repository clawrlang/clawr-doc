export function addScrollAnimation(anim) {
    animations.push(anim)
    if (state === UNINITIALIZED) startListening()
}

export function easeOut({ start, end, t }) {
    const easing = 1 + Math.pow(clamp(t, { min: 0, max: 1 }) - 1, 3)
    return clamp(start - easing * (start - end), { min: end, max: start })
}

function clamp(value, { min, max }) {
    return Math.max(min, Math.min(max, value))
}

const animations = []

function startListening() {
    state = WAITING
    addEventListener('scroll', () => {
        if (state === DRAWING) return
        state = DRAWING
        requestAnimationFrame(() => {
            for (const anim of animations) anim({ scrollY })
            state = WAITING
        })
    })
}

const DRAWING = { drawing: true }
const WAITING = { drawing: false }
const UNINITIALIZED = {}
let state = UNINITIALIZED
