function formatAdmonitions() {
    const callouts = [...document.querySelectorAll('blockquote > p')].filter(
        (p) => /^\[!(.*)\]/.test(p.textContent),
    )

    for (const p of callouts) {
        const type = p.textContent.match(/^\[!(.*)\]/)[1]
        const config = ADMONITIONS[type.toLowerCase()]

        p.textContent = /^\[!(.*)\]$/.test(p.textContent)
            ? config.text
            : p.textContent.replace(/^\[!(.*)\]\s*/, '')

        p.classList.add('admonition-title', type)
        p.parentNode.classList.add('admonition', type)

        const icon = document.createElement('i')
        icon.setAttribute('data-lucide', config.icon)
        icon.classList.add('admonition-icon', type)
        p.insertBefore(icon, p.firstChild)
    }
}

addEventListener('DOMContentLoaded', () => {
    formatAdmonitions()
    lucide.createIcons()
})

const ADMONITIONS = {
    error: { icon: 'unplug', text: 'Error' },
    info: { icon: 'info', text: 'Info' },
    note: { icon: 'pencil', text: 'Note' },
    question: { icon: 'circle-question-mark', text: 'Question' },
    quote: { icon: 'message-square-quote', text: 'Quote' },
    tip: { icon: 'lightbulb', text: 'Hint' },
    todo: { icon: 'circle-check-big', text: 'TODO' },
    warning: { icon: 'triangle-alert', text: 'Warning' },
}
