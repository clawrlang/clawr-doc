import { easeOut, addScrollAnimation } from './scroll-animation.js'
import { onLightDarkModeChange } from './DarkMode.js'

addEventListener('DOMContentLoaded', () => {
    const navH = document.querySelector('h1:first-child')
    const navP =
        navH.nextElementSibling.tagName === 'P'
            ? navH.nextElementSibling
            : undefined
    const nav = document.createElement('p')
    nav.className = 'nav'
    nav.appendChild(navH)
    if (navP) {
        navP.innerHTML = ` ${navP.innerHTML}`
        nav.appendChild(navP)
    }

    document.body.prepend(nav)

    const headerEl = document.createElement('div')
    headerEl.className = 'header'
    headerEl.textContent =
        document.querySelector('.markdown-body>h1').textContent
    const div = document.createElement('div')
    div.className = 'nav-title'
    div.appendChild(headerEl)
    nav.appendChild(div)

    const totop = createToTopButton()
    div.appendChild(totop)

    addScrollAnimation(({ scrollY }) => {
        if (!nav) return
        const padding = easeOut({
            start: 15,
            end: 5,
            t: scrollY / 120,
        })
        nav.style.padding = `${padding}px 0`

        if (scrollY < 200) div.classList.remove('scrolled')
        else div.classList.add('scrolled')
    })

    decorateExternalLinks()
})

function decorateExternalLinks() {
    const externalLinks = document.querySelectorAll(
        `.markdown-body a[href^='http://'], .markdown-body a[href^='https://']`,
    )
    for (const a of externalLinks) {
        a.appendChild(createExtLinkImage())
    }
}

function createToTopButton() {
    const upImage = lucide.createElement(lucide.CircleChevronUp)

    onLightDarkModeChange(() => {
        upImage.setAttribute(
            'fill',
            document.body.computedStyleMap().get('background-color'),
        )
    })

    upImage.onclick = () => {
        scrollTo({ top: 0, behavior: 'smooth' })
    }

    return upImage
}

function createExtLinkImage() {
    return lucide.createElement(lucide.SquareArrowOutUpRight)
}
