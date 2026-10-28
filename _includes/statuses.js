addEventListener('DOMContentLoaded', (_) => {
    const pEls = [...document.querySelectorAll('blockquote > p')].filter((p) =>
        Object.keys(STATUSES).includes(p.textContent),
    )

    for (const p of pEls) {
        const config = STATUSES[p.textContent]

        const div = document.createElement('div')
        div.classList.add('status', p.textContent)

        const bq = p.parentElement
        bq.replaceWith(div)

        const title = document.createElement('span')
        title.className = 'title'
        title.textContent = `${config.emoji} ${p.textContent}`
        div.appendChild(title)

        const tooltip = document.createElement('span')
        tooltip.className = 'tooltip'
        tooltip.textContent = config.desc
        div.appendChild(tooltip)
    }
})

const STATUSES = {
    Adopted: {
        emoji: '✅',
        desc: 'Principle is in use in the ecosystem, or the feature has been implemented in the example implementation',
    },
    Proposed: {
        emoji: '💡',
        desc: 'An idea to be considered for adoption',
    },
    Draft: {
        emoji: '✍🏼',
        desc: 'A rough sketch of an idea',
    },
}
