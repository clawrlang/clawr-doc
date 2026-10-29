addEventListener('DOMContentLoaded', () => {
    const anonymousSnippets = [
        ...document.querySelectorAll('pre:not(.highlight)'),
    ]

    for (const snippet of anonymousSnippets) {
        snippet.classList.add('highlight')

        const code = snippet.firstChild
        const language = [...code.classList]
        code.classList = []

        const div = document.createElement('div')
        div.classList.add(...language, 'highlighter-rouge')

        // const highlight = document.createElement('div')
        // highlight.classList.add('highlight')
        // div.appendChild(highlight)
        // highlight.appendChild(snippet)

        snippet.replaceWith(div)
        div.appendChild(snippet)
    }

    const snippets = document.querySelectorAll('div.highlighter-rouge')

    for (const snippet of snippets) {
        const language = [...snippet.classList]
            .find((c) => /^language-/.test(c))
            .replace(/^language-/, '')
        const div = document.createElement('div')
        div.className = 'title'
        div.textContent = LANGUAGE_ALIASES[language] ?? language

        snippet.insertAdjacentElement('afterbegin', div)

        const copiedElement = document.createElement('span')
        copiedElement.className = 'copied'
        copiedElement.textContent = 'copied'
        div.appendChild(copiedElement)

        const iconElement = lucide.createElement(lucide.Copy)
        div.appendChild(iconElement)

        iconElement.onclick = () => {
            const codeElement = snippet.querySelector('code')
            navigator.clipboard.writeText(codeElement.textContent)
            div.classList.add('copied')
            setTimeout(() => {
                div.classList.remove('copied')
            }, 1000)
        }
    }
})

const LANGUAGE_ALIASES = {
    sh: 'shell',
}
