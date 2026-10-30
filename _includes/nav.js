addEventListener('DOMContentLoaded', (event) => {
    const navH = document.querySelector('h1:first-child')
    const navP =
        navH.nextElementSibling.tagName === 'P'
            ? navH.nextElementSibling
            : undefined
    const nav = document.createElement('p')
    nav.className = 'nav'
    nav.appendChild(navH)
    if (navP) nav.appendChild(navP)

    document.body.prepend(nav)

    const span = document.createElement('span')
    span.className = 'nav-title'
    nav.appendChild(span)

    span.innerHTML = ` \u00A0 / \u00A0 ${document.querySelector('.markdown-body>h1').innerHTML}`
    const totop = document.createElement('a')
    const upImage = lucide.createElement(lucide.CircleChevronUp)
    totop.appendChild(upImage)
    span.appendChild(totop)

    upImage.setAttribute(
        'fill',
        document.body.computedStyleMap().get('background-color'),
    )
    totop.onclick = () => {
        scrollTo({ top: 0, behavior: 'smooth' })
    }

    AnimationCenter.add(() => {
        if (!nav) return
        const padding = AnimationCenter.easeOut({
            start: 15,
            end: 5,
            t: scrollY / 120,
        })
        nav.style.padding = `${padding}px 0`
    })

    let ticking = false
    addEventListener('scroll', () => {
        if (ticking) return

        ticking = true
        requestAnimationFrame(() => {
            if (scrollY < 200) span.classList.remove('scrolled')
            else span.classList.add('scrolled')
            ticking = false
        })
    })
})
