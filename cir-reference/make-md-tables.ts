// Generates Markdown "Shape" tables from the declarations in cir.schema.json.
// Usage: node make-md-tables.ts [DefName ...]
// Without arguments, a table is generated for every node in the schema: pure `oneOf` collections
// and fragments that are only composed into other definitions are skipped.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

type Schema = { [keyword: string]: any }
type Property = { schemas: Schema[]; required: boolean; comment?: string }
type Properties = Map<string, Property>

const schemaPath = fileURLToPath(new URL('./cir.schema.json', import.meta.url))
const schema: Schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const defPrefix = '#/$defs/'

function defName(ref: string): string {
    if (!ref.startsWith(defPrefix)) throw new Error(`Unsupported $ref: ${ref}`)
    return ref.slice(defPrefix.length)
}

function getDef(name: string): Schema {
    const def = schema.$defs[name]
    if (!def) throw new Error(`Unknown definition: ${name}`)
    return def
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
function collectProperties(node: Schema): Properties {
    const parts: Properties[] = []
    if (node.$ref) parts.push(collectProperties(getDef(defName(node.$ref))))
    if (node.properties) {
        const required = new Set<string>(node.required ?? [])
        const own: Properties = new Map()
        for (const [name, propSchema] of Object.entries<Schema>(
            node.properties,
        )) {
            own.set(name, {
                schemas: [propSchema],
                required: required.has(name),
                comment: propSchema.$comment,
            })
        }
        parts.push(own)
    }
    for (const branch of node.allOf ?? []) parts.push(collectProperties(branch))
    if (node.oneOf) parts.push(alternatives(node.oneOf.map(collectProperties)))
    return parts.reduce(mergeAll, new Map())
}

// Renders a property schema as a list of alternative type names (unions are flattened).
function renderType(node: Schema): string[] {
    if (node.$ref) return [defName(node.$ref)]
    if (node.oneOf) return node.oneOf.flatMap(renderType)
    if (node.enum) return node.enum.map(literal)
    if (node.type === 'object') return ['object']
    if ('const' in node) return [literal(node.const)]
    if (node.type === 'string') return ['string']
    if (node.type === 'array') {
        const items = renderType(node.items)
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

function shapeTable(name: string): string {
    const props = collectProperties(getDef(name))
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
        props.get('kind')?.schemas[0].const ??
        props.get('universe')?.schemas[0].const ??
        name
    return `${markdownTable(['Field', 'Required', 'Type', 'Meaning'], rows)}\n\n> [!info] Table: the properties of the \`${nodeName}\` node`
}

function isCollection(def: Schema): boolean {
    return (
        Array.isArray(def.oneOf) &&
        !def.properties &&
        !def.allOf &&
        !def.$ref &&
        def.oneOf.every((member: Schema) => member.$ref)
    )
}

// A variant group's members all expose the same value for a shared discriminator (`kind` or `universe`).
function discriminatorOf(name: string): string | undefined {
    const props = collectProperties(getDef(name))
    for (const key of ['kind', 'universe']) {
        const prop = props.get(key)
        if (prop) {
            return JSON.stringify(
                [...new Set(prop.schemas.flatMap(renderType))].sort(),
            )
        }
    }
    return undefined
}

// A collection whose members all share the same discriminator is one node with variants.
function isVariantGroup(def: Schema): boolean {
    if (!isCollection(def)) return false
    const keys = def.oneOf.map((member: Schema) =>
        discriminatorOf(defName(member.$ref)),
    )
    return (
        keys[0] !== undefined &&
        keys.every((k: string | undefined) => k === keys[0])
    )
}

// Definitions that are only ever composed into others (via $ref/allOf), never used on their own.
function findFragments(): Set<string> {
    const composed = new Set<string>()
    const used = new Set<string>()
    const walk = (node: Schema, composition: boolean) => {
        if (!node || typeof node !== 'object') return
        if (node.$ref) (composition ? composed : used).add(defName(node.$ref))
        for (const item of node.allOf ?? []) walk(item, true)
        for (const member of node.oneOf ?? []) walk(member, false)
        for (const prop of Object.values<Schema>(node.properties ?? {}))
            walk(prop, false)
        if (node.items) walk(node.items, false)
    }
    walk(schema, false)
    for (const def of Object.values<Schema>(schema.$defs)) walk(def, true)
    return new Set([...composed].filter((name) => !used.has(name)))
}

function allNodes(): string[] {
    const fragments = findFragments()
    const entries = Object.entries<Schema>(schema.$defs)
    const hidden = new Set<string>(
        entries
            .filter(([, def]) => isVariantGroup(def))
            .flatMap(([, def]) =>
                def.oneOf.map((member: Schema) => defName(member.$ref)),
            ),
    )
    return entries
        .filter(
            ([name, def]) =>
                !hidden.has(name) &&
                !fragments.has(name) &&
                (!isCollection(def) || isVariantGroup(def)) &&
                collectProperties(def).size > 0,
        )
        .map(([name]) => name)
}

// const requested = process.argv.slice(2)
// const names = requested.length > 0 ? requested : allNodes()
// console.log(names.map(shapeTable).join('\n\n'))

type Manifest = Record<string /* doc path */, string[] /* def names */>

const manifest: Manifest = JSON.parse(
    readFileSync(new URL('./docs.manifest.json', import.meta.url), 'utf8'),
)

for (const [file, names] of Object.entries(manifest)) {
    let src = readFileSync(file, 'utf8')
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
            shapeTable(name) +
            '\n\n' +
            src.slice(j)
    }
    writeFileSync(file, src)
}
