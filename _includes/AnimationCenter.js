const AnimationCenter = new (class {
    constructor() {
        const animations = []
        this.add = animations.push.bind(animations)

        let ticking = false

        addEventListener('scroll', () => {
            if (ticking) return

            const el = document.querySelector('.nav')
            if (!el) return

            ticking = true
            requestAnimationFrame(() => {
                for (const anim of animations) anim()
                ticking = false
            })
        })
    }

    easeOut({ start, end, t }) {
        const easing = 1 + Math.pow(clamp(t, { min: 0, max: 1 }) - 1, 3)
        return clamp(start - easing * (start - end), { min: end, max: start })

        function clamp(value, { min, max }) {
            return Math.max(min, Math.min(max, value))
        }
    }
})()
