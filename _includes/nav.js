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

    const titleSpan = document.createElement('div')
    titleSpan.className = 'header'
    titleSpan.textContent =
        document.querySelector('.markdown-body>h1').textContent
    const div = document.createElement('div')
    div.className = 'nav-title'
    div.appendChild(titleSpan)
    nav.appendChild(div)

    const totop = createToTopButton()
    div.appendChild(totop)

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
            if (scrollY < 200) div.classList.remove('scrolled')
            else div.classList.add('scrolled')
            ticking = false
        })
    })

    function createToTopButton() {
        const totop = createUpImage()
        totop.onclick = () => {
            scrollTo({ top: 0, behavior: 'smooth' })
        }
        return totop
    }

    function createUpImage() {
        const upImage = lucide.createElement(lucide.CircleChevronUp)
        upImage.setAttribute(
            'fill',
            document.body.computedStyleMap().get('background-color'),
        )
        return upImage
    }
})
