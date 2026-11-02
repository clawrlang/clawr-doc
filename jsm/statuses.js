addEventListener('DOMContentLoaded', (_) => {
    const pEls = [...document.querySelectorAll('blockquote > p')].filter((p) =>
        /^Status: (.*?) (Draft|Proposed|Adopted)$/.test(p.textContent),
    )

    for (const p of pEls) {
        const [, statusText, status] = p.textContent.match(
            /^Status: (.*? (Draft|Proposed|Adopted))$/,
        )

        const div = document.createElement('div')
        div.classList.add('status', status)

        const bq = p.parentElement
        bq.replaceWith(div)

        const title = document.createElement('span')
        title.className = 'title'
        title.textContent = statusText
        div.appendChild(title)

        const tooltip = document.createElement('span')
        tooltip.className = 'tooltip'
        tooltip.textContent = TOOLTIP_TEXTS[status]
        div.appendChild(tooltip)
    }
})

const TOOLTIP_TEXTS = {
    Adopted:
        'Principle is in use in the ecosystem, or the feature has been implemented in the example implementation',
    Proposed: 'An idea to be considered for adoption',
    Draft: 'A rough sketch of an idea',
}
