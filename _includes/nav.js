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

    const container = document.querySelector('.markdown-body')
    container.prepend(nav)
})
