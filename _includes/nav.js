addEventListener('DOMContentLoaded', (event) => {
    const navH = document.querySelector('h1:first-child')
    const navP =
        navH.nextElementSibling.tagName === 'P'
            ? navH.nextElementSibling
            : undefined
    const nav = document.createElement('p')
    nav.className = 'nav'
    nav.appendChild(navH)
    nav.appendChild(navP)

    document.body.prepend(nav)

    AnimationCenter.add(() => {
        if (!nav) return
        const border = AnimationCenter.easeOut({
            start: 10,
            end: 5,
            t: scrollY / 120,
        })
        const padding = AnimationCenter.easeOut({
            start: 15,
            end: 5,
            t: scrollY / 120,
        })
        nav.style.padding = `${padding}px 0`
        nav.style.borderBottomWidth = `${border}px`
    })
})
