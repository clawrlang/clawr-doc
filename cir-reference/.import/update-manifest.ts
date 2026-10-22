#!/usr/bin/env node
// find-shapes.ts
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Opening tags only — the `<!--\s*shape:` prefix deliberately does NOT
// match the closing form `<!-- /shape: ... -->`.
const SHAPE_RE = /<!--\s*shape:\s*([^\s>]+?)\s*-->/g

// Directories that are never interesting to scan.
const SKIP_DIRS = new Set([
    'node_modules',
    '.git',
    '.hg',
    '.svn',
    'dist',
    'build',
    'out',
    '.next',
    '.cache',
])

async function* walk(dir: string): AsyncGenerator<string> {
    let entries
    try {
        entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
        return // unreadable dir — skip silently
    }
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            if (SKIP_DIRS.has(entry.name)) continue
            yield* walk(full)
        } else if (entry.isFile()) {
            yield full
        }
    }
}

async function extractShapes(file: string): Promise<string[]> {
    let content: string
    try {
        content = await fs.readFile(file, 'utf8')
    } catch {
        return [] // binary/unreadable — ignore
    }
    const seen = new Set<string>()
    for (const m of content.matchAll(SHAPE_RE)) {
        seen.add(m[1])
    }
    return [...seen]
}

async function main(): Promise<void> {
    const rootArg = process.argv[2]
    if (rootArg === '-h' || rootArg === '--help') {
        console.error('Usage: find-shapes [root-dir]')
        process.exit(0)
    }
    const root = path.resolve(rootArg ?? '..')
    const result: Record<string, string[]> = {}

    for await (const file of walk(root)) {
        const shapes = await extractShapes(file)
        if (shapes.length > 0) {
            result[path.relative(root, file)] = shapes
        }
    }

    process.stdout.write(JSON.stringify(result, null, 2) + '\n')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
