
export function extractRuntimeArg(argName: string): string | undefined {
    let extracted = process.argv.find((arg) => {
        return arg.includes(argName)
    })
    if (!extracted) return undefined
    return extracted.split('=')[1]
}