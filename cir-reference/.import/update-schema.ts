// Generates Markdown "Shape" tables from the definitions in cir.schema.json and every schema
// file it references (directly or indirectly), and writes them between the shape markers in the
// docs listed in docs.manifest.json.
// With allNodes(), a table can be generated for every node in the schema: pure `oneOf` collections
// and fragments that are only composed into other definitions are skipped.

import { readFileSync, writeFileSync } from 'node:fs'

type Schema = { [keyword: string]: any }
// A schema together with the file it was written in, which is what its relative $refs resolve against.
type Sourced = { schema: Schema; file: string }
type Property = { schemas: Sourced[]; required: boolean; comment?: string }
type Properties = Map<string, Property>
// `name` is undefined for the root of a file.
type Target = { file: string; name?: string }

const rootFile = 'cir.schema.json'
const defPrefix = '/$defs/'
const schemas = new Map<string, Schema>()

// Loads a schema file and, recursively, every file it refers to.
function load(file: string) {
    if (schemas.has(file)) return
    const text = readFileSync(new URL(`./${file}`, import.meta.url), 'utf8')
    schemas.set(file, JSON.parse(text))
    for (const [, path] of text.matchAll(/"\$ref"\s*:\s*"([^"#]+)#/g)) {
        load(path.replace(/^\.\//, ''))
    }
}
load(rootFile)

function resolveRef(ref: string, from: string): Target {
    const [path, fragment = ''] = ref.split('#')
    const file = path ? path.replace(/^\.\//, '') : from
    if (fragment === '') return { file }
    if (!fragment.startsWith(defPrefix))
        throw new Error(`Unsupported $ref: ${ref}`)
    return { file, name: fragment.slice(defPrefix.length) }
}

function getTarget({ file, name }: Target): Schema {
    const root = schemas.get(file)
    const target = name === undefined ? root : root?.$defs?.[name]
    if (!target) throw new Error(`Unknown definition: ${file}#${name ?? ''}`)
    return target
}

// The type name of a file's root schema (the union of everything defined for that kind of node).
function rootName(file: string): string {
    const names: Record<string, string> = {
        'valuesets.json': 'ValueSet',
        'cir.schema.json': 'Module',
    }
    const base = file.replace(/\.(schema\.)?json$/, '')
    return names[file] ?? base.charAt(0).toUpperCase() + base.slice(1, -1)
}

function typeName(ref: string, from: string): string {
    const target = resolveRef(ref, from)
    return target.name ?? rootName(target.file)
}

const nodeKey = ({ file, name }: Target) => `${file}#${name}`

// Finds a definition from a plain name (`Assign`) or a qualified one (`statements.json#Assign`).
// A plain name that exists in several files prefers `preferredFile`.
function findDef(name: string, preferredFile?: string): Target {
    if (name.includes('#')) {
        const [file, defName] = name.split('#')
        const target = {
            file: file.endsWith('.json') ? file : `${file}.json`,
            name: defName,
        }
        getTarget(target)
        return target
    }
    const matches = [...schemas]
        .filter(([, root]) => root.$defs?.[name])
        .map(([file]) => ({ file, name }))
    const preferred = matches.find((m) => m.file === preferredFile)
    if (preferred) return preferred
    if (matches.length === 1) return matches[0]
    if (matches.length === 0) throw new Error(`Unknown definition: ${name}`)
    const options = matches.map((m) => nodeKey(m)).join(', ')
    throw new Error(`Ambiguous definition ${name}; use one of: ${options}`)
}

// Conjunction (allOf/$ref/own properties): a later definition of a property narrows the earlier one.
function mergeAll(a: Properties, b: Properties): Properties {
    const result: Properties = new Map(a)
    for (const [name, prop] of b) {
        const existing = result.get(name)
        result.set(
            name,
            existing === undefined
                ? prop
                : {
                      schemas: prop.schemas,
                      required: existing.required || prop.required,
                      comment: prop.comment ?? existing.comment,
                  },
        )
    }
    return result
}

// Keys present in every branch are kept; a property is required only if every branch requires it.
function alternatives(branches: Properties[]): Properties {
    const names = new Set(branches.flatMap((branch) => [...branch.keys()]))
    const result: Properties = new Map()
    for (const name of names) {
        const props = branches
            .map((branch) => branch.get(name))
            .filter((p): p is Property => p !== undefined)
        result.set(name, {
            schemas: props.flatMap((p) => p.schemas),
            required:
                branches.length === props.length &&
                props.every((p) => p.required),
            comment: props.find((p) => p.comment !== undefined)?.comment,
        })
    }
    return result
}

// Collects the object properties of a schema, following $ref, allOf and oneOf.
function collectProperties(node: Schema, file: string): Properties {
    const parts: Properties[] = []
    if (node.$ref) {
        const target = resolveRef(node.$ref, file)
        parts.push(collectProperties(getTarget(target), target.file))
    }
    if (node.properties) {
        const required = new Set<string>(node.required ?? [])
        const own: Properties = new Map()
        for (const [name, propSchema] of Object.entries<Schema>(
            node.properties,
        )) {
            own.set(name, {
                schemas: [{ schema: propSchema, file }],
                required: required.has(name),
                comment: propSchema.$comment,
            })
        }
        parts.push(own)
    }
    for (const branch of node.allOf ?? [])
        parts.push(collectProperties(branch, file))
    if (node.oneOf)
        parts.push(
            alternatives(
                node.oneOf.map((branch: Schema) =>
                    collectProperties(branch, file),
                ),
            ),
        )
    return parts.reduce(mergeAll, new Map())
}

// Renders a property schema as a list of alternative type names (unions are flattened).
function renderType({ schema: node, file }: Sourced): string[] {
    if (node.$ref) return [typeName(node.$ref, file)]
    if (node.oneOf)
        return node.oneOf.flatMap((member: Schema) =>
            renderType({ schema: member, file }),
        )
    if (node.enum) return node.enum.map(literal)
    if (node.type === 'object') return ['object']
    if ('const' in node) return [literal(node.const)]
    if (node.type === 'string') return ['string']
    if (node.type === 'array') {
        const items = renderType({ schema: node.items, file })
        return [
            items.length === 1 ? `${items[0]}[]` : `(${items.join(' | ')})[]`,
        ]
    }
    throw new Error(`Unsupported property schema: ${JSON.stringify(node)}`)
}

function literal(value: unknown): string {
    return typeof value === 'string' ? JSON.stringify(value) : String(value)
}

function typeCell(alts: string[]): string {
    return alts.length === 1
        ? `\`${alts[0]}\``
        : `<code>${alts.join(' &#124; ')}</code>`
}

function markdownTable(header: string[], rows: string[][]): string {
    const widths = header.map((h, i) =>
        Math.max(h.length, ...rows.map((row) => row[i].length)),
    )
    const line = (cells: string[]) =>
        `| ${cells.map((c, i) => c.padEnd(widths[i])).join(' | ')} |`
    const separator = `| ${widths.map((w) => '-'.repeat(w)).join(' | ')} |`
    return [line(header), separator, ...rows.map(line)].join('\n')
}

function shapeTable(target: Target): string {
    const name = nodeKey(target)
    const props = collectProperties(getTarget(target), target.file)
    // The discriminator (`kind`, or `universe` for value-sets) is listed first, the rest keeps schema order.
    const rank = (field: string) =>
        ['kind', 'universe'].indexOf(field) + 1 || Infinity
    const fieldNames = [...props.keys()].sort((a, b) => rank(a) - rank(b))
    const rows = fieldNames.map((field) => {
        const prop = props.get(field)!
        if (prop.comment === undefined)
            console.error(`warning: ${name}.${field} has no $comment`)
        const alts = [...new Set(prop.schemas.flatMap(renderType))]
        return [
            `\`${field}\``,
            prop.required ? 'yes' : 'no',
            typeCell(alts),
            prop.comment ?? '',
        ]
    })

    const nodeName =
        props.get('kind')?.schemas[0].schema.const ??
        props.get('universe')?.schemas[0].schema.const ??
        target.name
    return `${markdownTable(['Field', 'Required', 'Type', 'Meaning'], rows)}\n\n> [!info] Table: the properties of the \`${nodeName}\` node`
}

type Manifest = Record<string /* doc path */, string[] /* def names */>
const manifest: Manifest = JSON.parse(
    readFileSync(new URL('./docs.manifest.json', import.meta.url), 'utf8'),
)

for (const [file, names] of Object.entries(manifest)) {
    let src = readFileSync(file, 'utf8')
    // Docs in `statements/` prefer definitions from statements.json, and so on.
    const preferredFile = `${file.split('/').at(-2)}.json`
    for (const name of names) {
        const start = `<!-- shape: ${name} -->`
        const end = `<!-- /shape: ${name} -->`
        const i = src.indexOf(start)
        const j = src.indexOf(end)
        if (i < 0 || j < 0) {
            console.error(`markers for ${name} not found in ${file}`)
            continue
        }
        src =
            src.slice(0, i + start.length) +
            '\n\n' +
            shapeTable(findDef(name, preferredFile)) +
            '\n\n' +
            src.slice(j)
    }
    writeFileSync(file, src)
}
