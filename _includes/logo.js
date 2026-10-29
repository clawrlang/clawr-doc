addEventListener('DOMContentLoaded', (event) => {
    const el = document.createElement('img')
    el.src = '/clawr-doc/images/rawry-simplified.png'
    el.alt = 'Rawry'
    el.className = 'clawr-logo'
    document.body.appendChild(el)

    AnimationCenter.add(() => {
        const height = AnimationCenter.easeOut({
            start: 250,
            end: 70,
            t: scrollY / 400,
        })
        const top = AnimationCenter.easeOut({
            start: 10,
            end: 0,
            t: scrollY / 400,
        })

        el.style.height = `${height}px`
        el.style.top = `${top}px`
    })
})
