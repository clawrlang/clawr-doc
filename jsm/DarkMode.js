export function onLightDarkModeChange(updateUI) {
    toUpdate.push(updateUI)
    updateUI()
    if (toUpdate.length === 1) startListening()
}

const toUpdate = []

function startListening() {
    matchMedia('(prefers-color-scheme: dark)').addEventListener(
        'change',
        () => {
            for (const updateUI of toUpdate) updateUI()
        },
    )
}
